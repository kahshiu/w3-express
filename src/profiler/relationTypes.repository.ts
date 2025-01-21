import { selectTemplate, upsertTemplate } from "@src/db/templates";
import { logger } from "@src/logger";
import { PoolClient } from "pg";
import { IRelationTypeModel } from "./domain/RelationType";

export const upsertRelationType = async (data: IRelationTypeModel, options: { client: PoolClient }) => {
    const { client } = options;

    const frags = upsertTemplate(data);
    const columns = frags.map(({ column }) => column).join(",")
    const placeholders = frags.map(({ placeholder }) => placeholder).join(",")
    const values = frags.map(({ value }) => value)

    const updateColumns = frags
        .filter(({ columnOrig }) => columnOrig !== "relationId")
        .map(({ updateExcludedColumn }) => updateExcludedColumn).join(",")

    logger.info({ columns, placeholders, values, updateColumns }, "tracing sql: insert relation types")
    const records = await client.query({
        text:
            `insert into my_way2.relation_types (
                ${columns}
            ) values (
                ${placeholders}
            ) on conflict on constraint pk_relation_types do update set
                ${updateColumns}
            returning ${columns}`,
        values,
    })
    return records.rows.map((row) => selectTemplate(row));
}

export const selectRelationTypes = async (options: { client: PoolClient }) => {
    const { client } = options;
    const records = await client.query(
        `select relation_id, relation_name, relation_description
        from my_way2.relation_types;`
    )
    return records.rows.map((row) => selectTemplate(row));
}