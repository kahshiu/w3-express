import { getTemplateFragments, useSelectTemplate } from "@src/db/templates";
import { EntityClass, PrimaryType } from "@src/helpers/enums";
import { logger } from "@src/logger";
import { PoolClient } from "pg";
import { EntityModel } from "./domain/base/Entity";
import { omit } from "es-toolkit";

export const insertEntity = async <M extends EntityModel>(data: M, options: { client: PoolClient }) => {
    const { client } = options;
    const frags = getTemplateFragments(data);
    const columns = frags.map(({ column }) => column).join(",");

    const insertData = omit(data, ["entityId"]);
    const insertFrags = getTemplateFragments(insertData); 
    const insertColumns = insertFrags.map(({ column }) => column).join(",");
    const insertPlaceholders = insertFrags.map(({ placeholder }) => placeholder).join(",");
    const insertValues = insertFrags.map(({ value }) => value);

    logger.info({ insertColumns, insertValues }, "tracing sql: insert entity")
    const result = await client.query({
        name: "insert entity",
        text:
            `insert into my_way2.entity (
                ${insertColumns}
            ) values (
                ${insertPlaceholders}
            ) returning ${columns}`,
        values: insertValues,
    })
    return result.rows.map((row) => useSelectTemplate(row));
}

export const updateEntity = async <M extends EntityModel>(data: M, options: {
    client: PoolClient,
    criteria: {
        entityId?: number,
        entityClass?: EntityClass,
        entityTypePrimary?: PrimaryType,
    },
}) => {
    const { client, criteria: { entityId, entityClass, entityTypePrimary } } = options;
    const excludeColumns: (keyof M)[] = ["entityId", "entityClass", "entityTypePrimary"];

    const frags = getTemplateFragments(data);
    const columns = frags.map(({ column }) => column).join(",");

    const updateData = omit(data, excludeColumns);
    const updateFrags = getTemplateFragments(updateData);
    const updatePlaceholders = updateFrags.map(({ updatePlaceholder }) => updatePlaceholder).join(",");
    const values = updateFrags.map(({ value }) => value)

    const whereArr: string[] = [];
    if (entityId && entityId > 0) {
        whereArr.push(`entity_id = ${entityId}`)
    }
    if (entityClass) {
        whereArr.push(`entity_class = ${entityClass}`)
    }
    if (entityTypePrimary) {
        whereArr.push(`entity_type_primary = ${entityTypePrimary}`)
    }
    const whereClause = whereArr.length > 0 ? `where ${whereArr.join(" and ")}` : "";

    logger.info({ updatePlaceholders, values, whereClause }, "tracing sql: update entity")
    const result = await client.query({
        name: "update entity",
        text:
            `update my_way2.entity set
                ${updatePlaceholders}
            ${whereClause}
            returning entity_id, ${columns}`,
        values,
    }
    )
    return result.rows.map((row) => useSelectTemplate(row));
}

export const selectEntities = async (columns: string[], options: {
    client: PoolClient,
    criteria: {
        includeIds?: number[],
        entityClass?: EntityClass,
        entityTypePrimary?: PrimaryType,
    },
}) => {
    const { client, criteria } = options;
    const { includeIds, entityClass, entityTypePrimary } = criteria

    const whereArr: string[] = [];
    if (includeIds && includeIds.length > 0) {
        whereArr.push(`entity_id = ${includeIds}`)
    }
    if (entityClass) {
        whereArr.push(`entity_class = ${entityClass}`)
    }
    if (entityTypePrimary) {
        whereArr.push(`entity_type_primary = ${entityTypePrimary}`)
    }

    const columnsJoined = columns.join(",")
    const whereClause = whereArr.length > 0 ? `where ${whereArr.join(" and ")}` : "";
    const result = await client.query(
        `select ${columnsJoined}
        from my_way2.entity ${whereClause}`
    )
    return result.rows.map((row) => useSelectTemplate(row));
}