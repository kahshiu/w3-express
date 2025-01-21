import { selectTemplate, upsertTemplate } from "@src/db/templates";
import { logger } from "@src/logger";
import { PoolClient } from "pg";
import { IRelationModel } from "./domain/EntityRelation";
import { RelationStatus } from "@src/helpers/enums";

export const upsertEntityRelation = async (data: IRelationModel, options: { client: PoolClient }) => {
    const { client } = options;

    const frags = upsertTemplate(data);
    const columns = frags.map(({ column }) => column).join(",")
    const placeholders = frags.map(({ placeholder }) => placeholder).join(",")
    const values = frags.map(({ value }) => value)

    const updateColumns = frags
        .filter(({ columnOrig }) => !["parentId", "childId", "relationId"].includes(columnOrig))
        .map(({ updateExcludedColumn }) => updateExcludedColumn).join(",")

    logger.info({ columns, placeholders, values, updateColumns }, "tracing sql: insert relation types")
    const records = await client.query({
        text:
            `insert into my_way2.entity_relations (
                ${columns}
            ) values (
                ${placeholders}
            ) on conflict on constraint pk_entity_relations do update set
                ${updateColumns}
            returning ${columns}`,
        values,
    })
    const models = records.rows.map((row) => selectTemplate(row));
    return models;
}

export const deleteEntityRelations = async (
    parentId: number,
    childId: number,
    options: { client: PoolClient }
) => {
    const { client } = options;

    const result = await client.query({
        text: `
            update my_way2.entity_relations set 
                relation_status = ${RelationStatus.REMOVE}
                , deletion_date = $3
            where parent_id = $1 and child_id = $2
        ;`,
        values: [parentId, childId, new Date().toISOString()]
    })

    return result.rowCount;
}

export const selectEntityRelations = async (entityId: number, options: { client: PoolClient }) => {
    const { client } = options;

    const parentRecords = await client.query({
        text: `select 
            parent_id
            , child_id
            , relation_id 
            , relation_attributes
            , relation_status
        from my_way2.entity_relations
        where child_id = $1
        ;`,
        values: [entityId]
    })
    const relatedParents = parentRecords.rows.map((row) => selectTemplate(row));

    const childRecords = await client.query({
        name: "select relations",
        text: `select 
            parent_id
            , child_id
            , relation_id 
            , relation_attributes
            , relation_status
        from my_way2.entity_relations
        where parent_id = $1
        ;`,
        values: [entityId]
    })
    const relatedChild = childRecords.rows.map((row) => selectTemplate(row));
    return { relatedParents, relatedChild };
}
