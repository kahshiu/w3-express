import { getTemplateFragments } from "@src/db/templates";
import { logger } from "@src/logger";
import { PoolClient } from "pg";
import { RelationTypeModel } from "./domain/RelationType";

export const upsertRelationType = async (data: RelationTypeModel, options: { client: PoolClient }) => {
    const { client } = options;

    const frags = getTemplateFragments(data);
    const columns = frags.map(({ column }) => column).join(",")
    const placeholders = frags.map(({ placeholder }) => placeholder).join(",")
    const values = frags.map(({ value }) => value)
    const updateExcludedColumns = frags
        .filter(({ columnOrig }) => columnOrig !== "relationId")
        .map(({ updateExcludedColumn }) => updateExcludedColumn).join(",")

    logger.info({ columns, placeholders, updateExcludedColumns }, "tracing sql: insert relation types")
    const records = await client.query({
        name: "insert relation types",
        text:
            `insert into my_way2.relation_types (
                ${columns}
            ) values (
                ${placeholders}
            ) on conflict on constraint pk_relation_types do update set
                ${updateExcludedColumns}
            returning ${columns}`,
        values,
    })
    const models = records.rows.map((row) => {
        const model = new RelationTypeModel();
        return model.fromRecord(row)
    });
    return models;
}

export const selectRelationTypes = async (options: { client: PoolClient }) => {
    const { client } = options;
    const records = await client.query(
        `select 
            relation_id
            , relation_name
            , relation_description
        from my_way2.relation_types;`
    )
    const models = records.rows.map((row) => {
        const model = new RelationTypeModel();
        return model.fromRecord(row)
    });
    return models;
}
