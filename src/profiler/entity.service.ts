import { EntityType } from "@src/helpers/enums";
import { PoolClient } from "pg";
import { insertEntity, selectEntities, updateEntity } from "./entity.repository";
import { entitySpecs } from "./domain/entity/Config";
import { entityFromDto } from "./domain/entity/Entity";
import { IEntityDto } from "./domain/entity/IDto";

export const createEntity = async (
    entityType: EntityType,
    dto: IEntityDto,
    options: { client: PoolClient }
) => {
    const entityModel = entityFromDto(entityType, dto);
    const spec = entitySpecs[entityType];
    const returnedColumns = spec.columns;

    const entities = await insertEntity(
        entityModel,
        { ...options, returnedColumns }
    )
    return entities;
}

export const modifyEntity = async (
    entityType: EntityType,
    dto: IEntityDto,
    options: {
        client: PoolClient
    }
) => {
    const entityModel = entityFromDto(entityType, dto);
    const { entityId, entityClass, entityTypePrimary } = entityModel
    const spec = entitySpecs[entityType];
    const returnedColumns = spec.columns

    const entities = await updateEntity(
        entityModel,
        {
            ...options,
            returnedColumns,
            criteria: {
                entityId,
                entityClass,
                entityTypePrimary
            }
        },
    )
    return entities;
}

const getEntity = async (
    entityType: EntityType,
    options: {
        client: PoolClient,
        criteria: { includeIds: number[] }
    }
) => {
    const { client, criteria: { includeIds } } = options;
    const spec = entitySpecs[entityType];
    const entityModel = { ...spec.defaults };
    const { entityClass, entityTypePrimary } = entityModel;
    const selectColumns = Object.keys(entityModel);

    return selectEntities({
        client,
        selectColumns,
        criteria: {
            includeIds,
            entityClass,
            entityTypePrimary,
        },
    })
}

export const getEntities = async (options: { client: PoolClient, criteria: { includeIds: number[] } }) => {
    const [masterCompany, masterPerson, clientCompany, clientPerson, spCompany, spPerson] = await Promise.all([
        getEntity(EntityType.MASTER_COMPANY, options),
        getEntity(EntityType.MASTER_PERSON, options),
        getEntity(EntityType.CLIENT_COMPANY, options),
        getEntity(EntityType.CLIENT_PERSON, options),
        getEntity(EntityType.SERVICE_PROVIDER_COMPANY, options),
        getEntity(EntityType.SERVICE_PROVIDER_PERSON, options),
    ]);
    return {
        masterCompany,
        masterPerson,
        clientCompany,
        clientPerson,
        spCompany,
        spPerson,
    }
}
