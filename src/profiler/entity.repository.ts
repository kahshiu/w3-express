import { useInsertTemplate, useSelectTemplate, useUpdateTemplate } from "@src/db/templates";
import { PoolClient } from "pg";
import { ClientCompanyModel, ClientPersonModel } from "./domain/ClientEntity";
import { ServiceProviderCompanyModel, ServiceProviderPersonModel } from "./domain/ServiceProviders";
import { EntityClass, PrimaryType } from "@src/helpers/enums";

type EntityModel =
    ReturnType<typeof ServiceProviderCompanyModel.prototype.getValues>
    | ReturnType<typeof ServiceProviderPersonModel.prototype.getValues>
    | ReturnType<typeof ClientCompanyModel.prototype.getValues>
    | ReturnType<typeof ClientPersonModel.prototype.getValues>

export const insertEntity = async <T>(data: EntityModel, options: { client: PoolClient }) => {
    const { client } = options;
    const { entityId, ...entityToCreate } = data;
    const { keys: columns, values } = useInsertTemplate(entityToCreate)
    const columnsJoined = columns.join(",")
    const valuesJoined = values.join(",")
    const result = await client.query(
        `insert into my_way2.entity (
            ${columnsJoined}
        ) values (
            ${valuesJoined}
        ) returning entity_id, ${columnsJoined}`
    )
    return result.rows.map((row) => useSelectTemplate(row));
}

export const updateEntity = async <T>(data: EntityModel, options: { client: PoolClient }) => {
    const { client } = options;
    const { entityId, ...entityToUpdate } = data;

    const updateCols = useUpdateTemplate(entityToUpdate)
    const { keys: columns } = useInsertTemplate(entityToUpdate)
    const columnsJoined = columns.join(",")

    const result = await client.query(
        `update my_way2.entity set
            ${updateCols.join(",")}
        where entity_id = ${entityId}
        returning entity_id, ${columnsJoined}`
    )
    return result.rows.map((row) => useSelectTemplate(row));
}

export const selectEntities = async <T>(
    columns: string[],
    options: {
        client: PoolClient,
        criteria: {
            includeIds?: number[],
            entityClass?: EntityClass,
            entityTypePrimary?: PrimaryType,
        },
    }
) => {
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