import { EntityClass, EntityType, PrimaryType } from "@src/helpers/enums";
import { PoolClient } from "pg";
import { insertEntity, selectEntities, updateEntity } from "./entity.repository";
import { entitySpecs } from "./domain/entity/Config";
import { entityFromDto } from "./domain/entity/Entity";
import { IEntityDto } from "./domain/entity/IDto";
import { IRelationModel, relationfromEntityDto, relationfromEntityModel } from "./domain/EntityRelation";
import { upsertEntityRelation } from "./entityRelations.repository";

export const determineEntityType = (dto: IEntityDto) => {
    const { entityClass, entityTypePrimary } = dto;
    console.log("tracing details", entityClass, entityTypePrimary)
    if(entityClass === EntityClass.MASTER && entityTypePrimary === PrimaryType.COMPANY) return EntityType.MASTER_COMPANY;
    if(entityClass === EntityClass.MASTER && entityTypePrimary === PrimaryType.PERSONAL) return EntityType.MASTER_PERSON;
    if(entityClass === EntityClass.CLIENT && entityTypePrimary === PrimaryType.COMPANY) return EntityType.CLIENT_COMPANY;
    if(entityClass === EntityClass.CLIENT && entityTypePrimary === PrimaryType.PERSONAL) return EntityType.CLIENT_PERSON;
    if(entityClass === EntityClass.SERVICE_PROVIDER && entityTypePrimary === PrimaryType.COMPANY) return EntityType.SERVICE_PROVIDER_COMPANY;
    if(entityClass === EntityClass.SERVICE_PROVIDER && entityTypePrimary === PrimaryType.PERSONAL) return EntityType.SERVICE_PROVIDER_PERSON;
}

export const createEntity = async (
    entityType: EntityType,
    dto: IEntityDto,
    options: { client: PoolClient }
) => {
    const entityModel = entityFromDto(entityType, dto);
    const { childrenModel, parentsModel } = relationfromEntityDto(dto);
    const spec = entitySpecs[entityType];
    const returnedColumns = spec.columns;

    const entities = await insertEntity(
        entityModel,
        { ...options, returnedColumns }
    )

    const childrenModelSaved = childrenModel.map((child) => upsertEntityRelation(child, options))
    const parentsModelSaved = parentsModel.map((parent) => upsertEntityRelation(parent, options))

    const children = await Promise.all(childrenModelSaved);
    const parents = await Promise.all(parentsModelSaved);

    const cModel = children as unknown as IRelationModel[]
    const pModel = parents as unknown as IRelationModel[]

    const relations = relationfromEntityModel(cModel, pModel)
    const firstEntity = entities[0] 
    return { ...firstEntity, ...relations };
}

export const modifyEntity = async (
    entityType: EntityType,
    dto: IEntityDto,
    options: {
        client: PoolClient
    }
) => {
    console.log("tracing something",dto, entityType);
    const entityModel = entityFromDto(entityType, dto);
    const { entityId, entityClass, entityTypePrimary } = entityModel
    const { childrenModel, parentsModel } = relationfromEntityDto(dto);
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
    const childrenModelSaved = childrenModel.map((child) => upsertEntityRelation(child, options))
    const parentsModelSaved = parentsModel.map((parent) => upsertEntityRelation(parent, options))

    const children = await Promise.all(childrenModelSaved);
    const parents = await Promise.all(parentsModelSaved);

    const cModel = children as unknown as IRelationModel[]
    const pModel = parents as unknown as IRelationModel[]

    const relations = relationfromEntityModel(cModel, pModel)
    const firstEntity = entities[0]
    return { ...firstEntity, ...relations };
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
