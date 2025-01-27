import { selectTemplate } from "@src/db/templates";
import { HttpClientUnprocessableContent } from "@src/errors/HttpError";
import { runningNo, sanitizeText } from "@src/helpers/util";
import { PoolClient } from "pg";
import { ColumnTypes } from "./domain/ColumnTypes";

export const getTaskCustomColumns = async (
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
        name: "select task custom columns",
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

export const isColumnPopulated = async (
    columnName: string,
    options: { client: PoolClient }
) => {
    const { client } = options;
    const result = await client.query({
        name: "check task column",
        text: `select ${columnName} from my_way2.entity_tasks where ${columnName} is not null order by task_id limit 3;`
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

export const addTaskCustomColumn = async (
    columnName: string,
    dataType: string,
    options: { client: PoolClient }
) => {
    const { client } = options;
    await client.query({
        name: "add task column",
        text: `alter table my_way2.entity_tasks add column
            ${sanitizeText(columnName)} 
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
        name: "add task column",
        text: `alter table my_way2.entity_tasks drop column ${sanitizeText(columnName)} `
    })
}