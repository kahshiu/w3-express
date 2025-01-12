import { getTemplateFragments } from "@src/db/templates";
import { EntityType } from "@src/helpers/enums";
import { PoolClient } from "pg";
import { EntityModelManager } from "./domain/EntityModels";
import { selectEntities } from "./entity.repository";

const getEntity = async (entityType: EntityType, options: { client: PoolClient, criteria: { includeIds: number[] } }) => {
    const { client, criteria: { includeIds } } = options;
    const { instance } = new EntityModelManager(entityType);

    const frags = getTemplateFragments(instance.getValues());
    const columns = frags.map(({ column }) => column)

    return selectEntities(columns, {
        client,
        criteria: {
            includeIds,
            entityClass: instance.entity?.entityClass,
            entityTypePrimary: instance.entity?.entityTypePrimary,
        }
    })
}

export const getEntities = async (options: { client: PoolClient, criteria: { includeIds: number[] } }) => {
    const [clientCompany, clientPerson, spCompany, spPerson] = await Promise.all([
        getEntity(EntityType.CLIENT_COMPANY, options),
        getEntity(EntityType.CLIENT_PERSON, options),
        getEntity(EntityType.SERVICE_PROVIDER_COMPANY, options),
        getEntity(EntityType.SERVICE_PROVIDER_PERSON, options),
    ]);
    return {
        clientCompany,
        clientPerson,
        spCompany,
        spPerson,
    }
}
