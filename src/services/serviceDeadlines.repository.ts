import { selectTemplate, upsertTemplate } from "@src/db/templates";
import { logger } from "@src/logger";
import { PoolClient } from "pg";
import { IServiceDeadline } from "./domain/ServiceDeadline";

export const upsertServiceDeadline = async (data: IServiceDeadline, options: { client: PoolClient }) => {
    const { client } = options;
    const frags = upsertTemplate(data);
    const columns = frags.map(({ column }) => column).join(",")
    const placeholders = frags.map(({ placeholder }) => placeholder).join(",")
    const values = frags.map(({ value }) => value)

    const targetColumns = [
        "deadlineName",
        "dateStart",
        "intervalAdded"
    ];
    const updateExcludedColumns = frags
        .filter(({ columnOrig }) => targetColumns.includes(columnOrig))
        .map(({ updateExcludedColumn }) => updateExcludedColumn).join(",")

    logger.info({ columns, placeholders, updateExcludedColumns }, "tracing sql: insert relation types")
    const result = await client.query({
        name: "insert relation types",
        text:
            `insert into my_way2.service_deadlines (
                ${columns}
            ) values (
                ${placeholders}
            ) on conflict on constraint pk_deadline_types do update set
                ${updateExcludedColumns}
            returning ${columns}`,
        values,
    })
    return result.rows.map((row) => selectTemplate(row));
}

export const deleteServiceDeadlines = async (
    serviceTypeId: number,
    deadlineIds: number[],
    options: { client: PoolClient }
) => {
    const { client } = options;
    await client.query({
        name: "delete relation types",
        text: "delete from my_way2.service_deadlines where service_type_id = $1 and deadline_id in ( $2 )",
        values: [
            serviceTypeId,
            deadlineIds.join(",")
        ],
    })
}

export const getServiceDeadlines = async (
    serviceTypeId: number,
    options: { client: PoolClient }
) => {
    const { client } = options;
    const result = await client.query({
        name: "get relation types",
        text: `select 
            deadline_id
            , deadline_name
            , date_start
            , interval_added
            , service_type_id 
        from my_way2.service_deadlines where service_type_id = $1`,
        values: [serviceTypeId],
    })
    return result.rows.map((row) => selectTemplate(row));
}