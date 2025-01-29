import { PoolClient } from "pg";
import { addTaskCustomColumn, dropTaskCustomColumn, selectTaskCustomColumns, insertTask, isColumnPopulated, selectTask, updateTask } from "./tasks.repository";
import { logger } from "@src/logger";
import { IServiceTaskSchema, serviceTaskFromInsertDto, serviceTaskFromUpdateDto } from "./domain/ServiceTask";
import { HttpServerError } from "@src/errors/HttpError";

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
    options: { client: PoolClient }
) => {
    const hasData = await isColumnPopulated(columnName, options);
    if (hasData.length > 0) return false;

    await dropTaskCustomColumn(columnName, options);
    return true;
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