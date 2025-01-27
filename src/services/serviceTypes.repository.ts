import { selectTemplate, upsertTemplate } from "@src/db/templates";
import { logger } from "@src/logger";
import { PoolClient } from "pg";
import { IServiceType } from "./domain/ServiceType";

export const upsertServiceType = async (data: IServiceType, options: { client: PoolClient }) => {
    const { client } = options;

    const frags = upsertTemplate(data);
    const columns = frags.map(({ column }) => column).join(",")
    const placeholders = frags.map(({ placeholder }) => placeholder).join(",")
    const values = frags.map(({ value }) => value)

    const targetColumns = [
        "serviceTypeName", 
        "serviceTypeDescription", 
        "serviceTypeGrouping", 
        "serviceTypeDeadlines"
    ];
    const updateColumns = frags
        .filter(({ columnOrig }) => targetColumns.includes(columnOrig))
        .map(({ updateExcludedColumn }) => updateExcludedColumn).join(",")

    logger.info({ columns, placeholders, values, updateColumns }, "tracing sql: insert relation types")
    const records = await client.query({
        text:
            `insert into my_way2.service_types (
                ${columns}
            ) values (
                ${placeholders}
            ) on conflict on constraint pk_service_types do update set
                ${updateColumns}
            returning ${columns}`,
        values,
    })
    return records.rows.map((row) => selectTemplate(row));
}