import { selectTemplate, toColumnName, upsertTemplate } from "@src/db/templates";
import { EntityClass, PrimaryType } from "@src/helpers/enums";
import { logger } from "@src/logger";
import { omit } from "es-toolkit";
import { PoolClient } from "pg";

export const insertEntity = async (data: any, options: {
    client: PoolClient,
    returnedColumns: string[],
}) => {
    const { client, returnedColumns } = options;
    const excludeColumns = ["entityId"]

    const insertFrags = upsertTemplate(
        omit(data, excludeColumns)
    );
    const insertColumns = insertFrags.map(({ column }) => column).join(",");
    const insertPlaceholders = insertFrags.map(({ placeholder }) => placeholder).join(",");
    const insertValues = insertFrags.map(({ value }) => value);

    logger.info({ insertColumns, insertValues }, "tracing sql: insert entity")
    const records = await client.query({
        text:
            `insert into my_way2.entity (
                ${insertColumns}
            ) values (
                ${insertPlaceholders}
            ) returning ${returnedColumns.map((col) => toColumnName(col))}`,
        values: insertValues,
    })
    return records.rows.map((row) => selectTemplate(row));
}

export const updateEntity = async (data: any, options: {
    client: PoolClient,
    returnedColumns: string[],
    criteria: {
        entityId: number,
        entityClass: EntityClass,
        entityTypePrimary: PrimaryType,
    },
}) => {
    const { client, returnedColumns, criteria: { entityId, entityClass, entityTypePrimary } } = options;

    const excludeColumns = ["entityId", "entityClass", "entityTypePrimary"];
    const updateData = omit(data, excludeColumns);
    const updateFrags = upsertTemplate(updateData);
    const updatePlaceholders = updateFrags.map(({ updatePlaceholder }) => updatePlaceholder).join(",");
    const values = updateFrags.map(({ value }) => value)

    const whereArr: string[] = [];
    if (entityId && entityId > 0) {
        whereArr.push(`entity_id = ${entityId}`)
    }
    whereArr.push(`entity_class = ${entityClass}`)
    whereArr.push(`entity_type_primary = ${entityTypePrimary}`)
    const whereClause = whereArr.length > 0 ? `where ${whereArr.join(" and ")}` : "";

    logger.info({ updatePlaceholders, values, whereClause }, "tracing sql: update entity")
    const records = await client.query({
        text:
            `update my_way2.entity set ${updatePlaceholders}
            ${whereClause}
            returning ${returnedColumns.map((col) => toColumnName(col))}`,
        values,
    })
    return records.rows.map((row) => selectTemplate(row));
}

export const selectEntities = async (options: {
    client: PoolClient,
    selectColumns: string[],
    criteria: {
        includeIds: number[],
        entityClass?: EntityClass,
        entityTypePrimary?: PrimaryType
    },
}) => {
    const { client, selectColumns, criteria: { includeIds, entityClass, entityTypePrimary } } = options;

    const whereArr: string[] = [];
    if (includeIds.length > 0) {
        whereArr.push(`entity_id in (${includeIds})`)
    }
    if (entityClass) whereArr.push(`entity_class = ${entityClass}`)
    if (entityTypePrimary) whereArr.push(`entity_type_primary = ${entityTypePrimary}`)
    const whereClause = whereArr.length > 0 ? `where ${whereArr.join(" and ")}` : "";

    logger.info({ selectColumns, whereArr }, `check entity model`);
    const records = await client.query(`
        select ${selectColumns.map((col) => toColumnName(col))} 
        from my_way2.entity ${whereClause}`)
    return records.rows.map((row) => selectTemplate(row));
}