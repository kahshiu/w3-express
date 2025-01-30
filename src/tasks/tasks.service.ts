import { isNull, omit } from "es-toolkit";
import { get } from "es-toolkit/compat";
import { PoolClient } from "pg";
import { IServiceTaskSchema, serviceTaskFromInsertDto, serviceTaskFromUpdateDto } from "./domain/ServiceTask";
import { addTaskCustomColumn, dropTaskCustomColumn, selectTaskCustomColumns, insertTask, isColumnPopulated, selectTask, updateTask } from "./tasks.repository";
import { logger } from "@src/logger";
import { HttpServerError } from "@src/errors/HttpError";
import { deleteServiceDeadlinesByName, getServiceDeadlines } from "@src/services/serviceDeadlines.repository";
import { upsertTemplate, selectTemplate, toColumnName } from "@src/db/templates";
import { intervalToColumn } from "@src/helpers/common/IInterval";
import { IEntityModel } from "@src/profiler/domain/entity/IModel";
import { selectEntities } from "@src/profiler/entity.repository";
import { IServiceDeadline } from "@src/services/domain/ServiceDeadline";
import { runningNo, runningNoResult } from "@src/helpers/util";

export const createTaskColumn = async (
    columnName: string,
    dataType: string,
    options: { client: PoolClient }
) => {
    logger.info({ columnName, dataType }, "tracing name of new column")
    const existingColumns = await selectTaskCustomColumns({
        ...options,
        criteria: { columnNames: [columnName] }
    });
    const isExistsColumn = existingColumns.find((c) => c.columnName === columnName);
    if (isExistsColumn) return false;

    await addTaskCustomColumn(columnName, dataType, options);
    return true;
}

export const removeTaskColumn = async (
    columnName: string,
    options: {
        client: PoolClient,
        syncDropDeadlines: boolean,
    }
) => {
    try {
        const hasData = await isColumnPopulated(columnName, options);
        if (hasData.length > 0) return false;

        await dropTaskCustomColumn(columnName, options);
        if (options.syncDropDeadlines) {
            await deleteServiceDeadlinesByName(columnName, options);
        }
        return true;

    } catch (err) {
        const error = err as Error;
        const isMissingColumn = error.message.startsWith("column") && error.message.endsWith("does not exist");
        if (isMissingColumn) {
            logger.warn(err, "attempting to drop missing column");
            return
        }
        return true;
    }
}

export const createClientTask = async (
    dto: IServiceTaskSchema,
    entityId: number,
    options: { client: PoolClient }
) => {
    const data = await serviceTaskFromInsertDto(dto, entityId);
    const { taskYear, serviceTypeId } = dto;
    const existTask = await selectTask({
        ...options,
        criteria: {
            entityId,
            taskYear,
            serviceTypeId
        }
    });
    if (existTask.length > 0) {
        throw new HttpServerError(`Cannot create a duplicate client task`)
    }
    const task = await insertTask(
        data,
        options,
    );
    return task;
}

export const modifyClientTask = async (
    dto: IServiceTaskSchema,
    entityId: number,
    taskId: number,
    options: { client: PoolClient }
) => {
    const data = await serviceTaskFromUpdateDto(dto, entityId);
    const task = await updateTask(
        data,
        {
            ...options,
            criteria: {
                taskId,
                entityId,
            }
        },
    );
    return task;
}

export const getClientTask = async (
    options: {
        client: PoolClient
        criteria: {
            taskId?: number
            taskYear?: number
            entityId?: number
            serviceId?: number
            serviceTypeId?: number
        }
    }
) => {
    const task = await selectTask(options);
    return task;
}

export const applyDeadline = async (
    taskId: number,
    options: {
        client: PoolClient
        cutoffDate?: Date,
        forceUpdate?: boolean
    }
) => {
    const { client } = options;
    /* NOTE:
    1. get task details
    2. get deadline details
    3. get entity details
    4. apply update onto base on alias
    5. get task details 
    */
    const tasks = await getClientTask({
        ...options,
        criteria: {
            taskId,
        }
    })
    const firstTask = tasks[0];
    const { serviceTypeId, entityId } = firstTask;
    const deadlines = await getServiceDeadlines(serviceTypeId, options);
    const selectColumns = [
        "entityId",
        "dateIncorp",
        "dateCommence",
        "yearEndMonth",
        "arDueMonth",
    ];
    const entities = await selectEntities({
        ...options,
        selectColumns,
        criteria: {
            includeIds: [entityId],
        }
    });
    const ent = entities[0] as IEntityModel;
    const indexNo = runningNo(1);
    const updatePlaceholders: any = [];
    const updateValues: any = [];
    deadlines.forEach((d) => {
        const toReplace = isNull(firstTask[d.deadlineName]) || options.forceUpdate;
        // if (toReplace) {
        const { columnName, columnPlaceholder, columnValue } = formatDeadlineSql(d as IServiceDeadline, { ent }, { ...options, indexNo });
        updatePlaceholders.push(columnPlaceholder);
        updateValues.push(...columnValue);
        // }
    })

    // UPDATE
    // exclude all base columns, only update 
    const excludedColumns = [
        "taskId",
        "taskYear",
        "taskStatus",
        "taskStatus",
        "taskCreatedBy",
        "taskCreatedDate",
        "remarks",
        "entityId",
        "serviceId",
        "serviceTypeId",
        "serviceTypeName",
        "serviceInternalProviderId",
        "serviceExternalProviderId",
        "workflowHistory",
        "workflowCurrent",
    ];

    const temp = await selectTaskCustomColumns({
        client,
        criteria: { dataTypes: [] }
    })
    const returnColumns = [
        ...excludedColumns.map((c) => toColumnName(c)),
        ...temp.map((col) => col.columnName),
    ].join(",")

    const whereArr: string[] = [];
    if (taskId && taskId > 0) { whereArr.push(`task_id = ${taskId}`) }
    const whereClause = whereArr.length > 0 ? `where ${whereArr.join(" and ")}` : "";

    logger.info({ updatePlaceholders, whereClause, returnColumns }, "tracing sql: update deadline")
    const records = await client.query({
        text:
            `update my_way2.entity_tasks set ${updatePlaceholders}
            ${whereClause}
            returning ${returnColumns}`,
        values: updateValues,
    })
    return records.rows.map((row) => selectTemplate(row));
}

const formatDeadlineSql = (
    deadline: IServiceDeadline,
    store: { ent: IEntityModel },
    options: {
        indexNo: runningNoResult
        cutoffDate?: Date
    }
) => {
    const cutoffDate = options.cutoffDate ?? new Date().toISOString();
    const { dateStart, intervalAdded, deadlineName } = deadline;
    const dateStartStr = get(store, dateStart)?.toISOString();
    const intervalStr = intervalToColumn(intervalAdded)

    logger.info({ dateStartStr, intervalStr }, "tracing deadline sql")
    return {
        columnName: deadlineName,
        columnPlaceholder: `${deadlineName} = my_way2.to_next_financial_year($${options.indexNo.next()}::timestamptz, $${options.indexNo.next()}::timestamptz) + $${options.indexNo.next()}`,
        columnValue: [dateStartStr, cutoffDate, intervalStr]
    }
}