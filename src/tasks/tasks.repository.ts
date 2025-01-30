import { selectTemplate, toColumnName, upsertTemplate } from "@src/db/templates";
import { HttpClientUnprocessableContent } from "@src/errors/HttpError";
import { runningNo, sanitizeText } from "@src/helpers/util";
import { PoolClient } from "pg";
import { ColumnTypes } from "./domain/ColumnTypes";
import { IServiceTaskSchema } from "./domain/ServiceTask";
import { omit } from "es-toolkit/compat";
import { logger } from "@src/logger";
import { getServiceClient } from "@src/services/serviceClient.repository";

export const selectTaskCustomColumns = async (
    options: {
        client: PoolClient,
        criteria: {
            dataTypes?: string[],
            columnNames?: string[],
        }
    }
) => {
    const { client, criteria: { dataTypes, columnNames } } = options;

    const whereArr: string[] = [];
    const valueArr: string[] = [];
    const no = runningNo(1)
    if (dataTypes && dataTypes.length > 0) {
        const placeholders = dataTypes.map((d) => `$${no.next()}`)
        const dataTypesPatched = dataTypes.map((dt) => {
            if (dt === "money") return "numeric";
            return dt;
        })
        whereArr.push(`(  data_type in (${placeholders}) or udt_name in (${placeholders})  )`)
        valueArr.push(...dataTypesPatched)
    }
    if (columnNames && columnNames.length > 0) {
        const placeholders = columnNames.map((d) => `$${no.next()}`)
        whereArr.push(`( column_name in (${placeholders}) )`)
        valueArr.push(...columnNames)
    }
    const whereClause = whereArr.length > 0 ? `and ${whereArr.join(" and ")}` : "";

    const result = await client.query({
        text: `select column_name, data_type, udt_name 
            from information_schema.columns 
            where table_schema = 'my_way2' 
                and table_name = 'entity_tasks'
                and ordinal_position > 14
                ${whereClause}
        `,
        values: valueArr,
    })
    return result.rows.map((row) => selectTemplate(row));
}

export const setColumnTypes = (dataType: string) => {
    let dt = ColumnTypes[dataType];
    if (dt === "money") dt = "decimal(10,2)"
    if (dt === undefined) {
        throw new HttpClientUnprocessableContent("Invalid datatype")
    }
    return dt;
}

export const isColumnPopulated = async (
    columnName: string,
    options: { client: PoolClient }
) => {
    const { client } = options;
    const result = await client.query({
        text: `select ${columnName} from my_way2.entity_tasks where ${columnName} is not null order by task_id limit 3;`
    })
    return result.rows.map((row) => selectTemplate(row));
}

export const addTaskCustomColumn = async (
    columnName: string,
    dataType: string,
    options: { client: PoolClient }
) => {
    const { client } = options;
    await client.query({
        text: `alter table my_way2.entity_tasks add column
            ${sanitizeText(toColumnName(columnName))} 
            ${setColumnTypes(dataType)} 
            `
    })
}

export const dropTaskCustomColumn = async (
    columnName: string,
    options: { client: PoolClient }
) => {
    const { client } = options;
    await client.query({
        text: `alter table my_way2.entity_tasks drop column ${sanitizeText(toColumnName(columnName))} `
    })
}

// NOTE: Task CRUD
export const selectTask = async (
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
    const {
        client,
        criteria: {
            taskId,
            taskYear,
            entityId,
            serviceId,
            serviceTypeId,
        }
    } = options;

    const whereArr: string[] = [];
    if (taskId && taskId > 0) whereArr.push(`task_id = ${taskId}`)
    if (taskYear && taskYear > 0) whereArr.push(`task_year = ${taskYear}`)
    if (entityId && entityId > 0) whereArr.push(`entity_id = ${entityId}`)
    if (serviceId && serviceId > 0) whereArr.push(`service_id = ${serviceId}`)
    if (serviceTypeId && serviceTypeId > 0) whereArr.push(`service_type_id = ${serviceTypeId}`)
    const whereClause = whereArr.length > 0 ? `where ${whereArr.join(" and ")}` : "";

    const records = await client.query({
        text: `select * from my_way2.entity_tasks ${whereClause}`,
    })
    return records.rows.map((row) => selectTemplate(row));
}

export const insertTask = async (
    data: IServiceTaskSchema,
    options: { client: PoolClient }
) => {
    const { client } = options;
    const excludeColumns = ["taskId"]

    const serviceDetails = await getServiceClient({
        ...options,
        criteria: {
            entityId: data.entityId,
            serviceTypeId: data.serviceTypeId,
        }
    })
    const firstServiceDetails = serviceDetails[0];
    const { serviceTypeId, serviceTypeName } = firstServiceDetails;

    const insertFrags = upsertTemplate(
        omit(
            { ...data, serviceTypeId, serviceTypeName },
            excludeColumns
        )
    );
    const temp = await selectTaskCustomColumns({
        client,
        criteria: { dataTypes: [] }
    })

    const insertColumns = insertFrags.map(({ column }) => column).join(",");
    const insertPlaceholders = insertFrags.map(({ placeholder }) => placeholder).join(",");
    const insertValues = insertFrags.map(({ value }) => value);

    const returnedColumns = [
        ...insertFrags.map(({ column }) => column),
        ...temp.map((col) => col.columnName),
    ].join(",")

    logger.info({ insertColumns, insertValues }, "tracing sql: insert task")
    const records = await client.query({
        text: `insert into my_way2.entity_tasks (
            ${insertColumns}
        ) values (
            ${insertPlaceholders}
        ) returning ${returnedColumns}`,
        values: insertValues,
    })
    return records.rows.map((row) => selectTemplate(row));
}

export const updateTask = async (
    data: IServiceTaskSchema,
    options: {
        client: PoolClient
        criteria: {
            taskId: number,
            taskYear?: number,
            entityId?: number,
            serviceId?: number,
        },
    }
) => {
    const {
        client,
        criteria: {
            taskId,
            taskYear,
            entityId,
            serviceId,
        }
    } = options;
    const excludeColumns = [
        "taskId",
        "taskYear",
        "taskCreatedBy",
        "taskCreatedDate",
        "entityId",
        "serviceId",
        "serviceTypeId", // convenient ref
        "serviceName", // convenient ref
    ];
    const temp = await selectTaskCustomColumns({
        client,
        criteria: { dataTypes: [] }
    })

    const updateData = omit(data, excludeColumns);
    const updateFrags = upsertTemplate(updateData);
    const updatePlaceholders = updateFrags.map(({ updatePlaceholder }) => updatePlaceholder).join(",");
    const values = updateFrags.map(({ value }) => value)
    const returnColumns = [
        ...updateFrags.map(({ column }) => column),
        ...temp.map((col) => col.columnName),
    ].join(",")

    const whereArr: string[] = [];
    if (taskId && taskId > 0) { whereArr.push(`task_id = ${taskId}`) }
    if (taskYear && taskYear > 0) { whereArr.push(`task_year = ${taskYear}`) }
    if (entityId && entityId > 0) { whereArr.push(`entity_id = ${entityId}`) }
    if (serviceId && serviceId > 0) { whereArr.push(`service_id = ${serviceId}`) }
    const whereClause = whereArr.length > 0 ? `where ${whereArr.join(" and ")}` : "";

    const records = await client.query({
        text: `update my_way2.entity_tasks set 
            ${updatePlaceholders}
            ${whereClause}
            returning ${returnColumns}`,
        values,
    });
    return records.rows.map((row) => selectTemplate(row));
}