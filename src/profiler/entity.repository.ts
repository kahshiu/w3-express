import { getTemplateFragments } from "@src/db/templates";
import { EntityType } from "@src/helpers/enums";
import { logger } from "@src/logger";
import { omit } from "es-toolkit";
import { PoolClient } from "pg";
import { EntityModel } from "./domain/base/Entity";
import { EntityModelManager } from "./domain/EntityModels";

export const insertEntity = async <M extends EntityModel>(entityType: EntityType, data: M, options: { 
    client: PoolClient 
}) => {
    const { client } = options;

    const { instance } = new EntityModelManager(entityType);
    const frags = getTemplateFragments(instance.getValues());
    const selectedColumns = frags.map(({ column }) => column).join(",")

    const insertData = omit(data, ["entityId"]);
    const insertFrags = getTemplateFragments(insertData);
    const insertColumns = insertFrags.map(({ column }) => column).join(",");
    const insertPlaceholders = insertFrags.map(({ placeholder }) => placeholder).join(",");
    const insertValues = insertFrags.map(({ value }) => value);

    logger.info({ insertColumns, insertValues }, "tracing sql: insert entity")
    const records = await client.query({
        name: "insert entity",
        text:
            `insert into my_way2.entity (
                ${insertColumns}
            ) values (
                ${insertPlaceholders}
            ) returning ${selectedColumns}`,
        values: insertValues,
    })
    const models = records.rows.map((row) => {
        const { instance } = new EntityModelManager(entityType);
        instance.fromRecord(row);
        return instance.getValues()
    });
    return models;
}

export const updateEntity = async <M extends EntityModel>(entityType: EntityType, data: M, options: {
    client: PoolClient,
    criteria: { entityId: number },
}) => {
    const { client, criteria: { entityId } } = options;

    const { instance } = new EntityModelManager(entityType);
    const frags = getTemplateFragments(instance.getValues());
    const selectedColumns = frags.map(({ column }) => column).join(",")

    const excludeColumns: (keyof M)[] = ["entityId", "entityClass", "entityTypePrimary"];
    const updateData = omit(data, excludeColumns);
    const updateFrags = getTemplateFragments(updateData);
    const updatePlaceholders = updateFrags.map(({ updatePlaceholder }) => updatePlaceholder).join(",");
    const values = updateFrags.map(({ value }) => value)

    const whereArr: string[] = [];
    if (entityId && entityId > 0) {
        whereArr.push(`entity_id = ${entityId}`)
    }
    whereArr.push(`entity_class = ${instance.entity.entityClass}`)
    whereArr.push(`entity_type_primary = ${instance.entity.entityTypePrimary}`)
    const whereClause = whereArr.length > 0 ? `where ${whereArr.join(" and ")}` : "";

    logger.info({ updatePlaceholders, values, whereClause }, "tracing sql: update entity")
    const records = await client.query({
        name: "update entity",
        text:
            `update my_way2.entity set ${updatePlaceholders}
            ${whereClause}
            returning ${selectedColumns}`,
        values,
    })
    const models = records.rows.map((row) => {
        const { instance } = new EntityModelManager(entityType);
        instance.fromRecord(row);
        return instance.getValues()
    });
    return models;
}

export const selectEntities = async (entityType: EntityType, options: {
    client: PoolClient,
    criteria: { includeIds?: number[] },
}) => {
    const { instance } = new EntityModelManager(entityType);
    const frags = getTemplateFragments(instance.getValues());
    const selectedColumns = frags.map(({ column }) => column).join(",")

    const { client, criteria } = options;
    const { includeIds } = criteria

    const whereArr: string[] = [];
    if (includeIds && includeIds.length > 0) {
        whereArr.push(`entity_id = ${includeIds}`)
    }
    whereArr.push(`entity_class = ${instance.entity.entityClass}`)
    whereArr.push(`entity_type_primary = ${instance.entity.entityTypePrimary}`)
    const whereClause = whereArr.length > 0 ? `where ${whereArr.join(" and ")}` : "";

    logger.info({ selectedColumns, whereArr }, `check entity model`);
    const records = await client.query(`select ${selectedColumns} from my_way2.entity ${whereClause}`)
    const models = records.rows.map((row) => {
        const { instance } = new EntityModelManager(entityType);
        instance.fromRecord(row);
        return instance.getValues()
    });
    return models;
}