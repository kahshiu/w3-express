import { useInsertTemplate } from "@src/db/templates";
import { wrapTask } from "@src/db/PgHelpers";
import { ClientCompanyRecord, ClientPersonRecord } from "./domain/ClientEntity";
import { ServiceProviderCompanyRecord, ServiceProviderPersonRecord } from "./domain/ServiceProviders";
import { selectEntities } from "./entity.repository";
import { PoolClient } from "pg";
import { MasterCompanyRecord, MasterPersonRecord } from "./domain/MasterEntity";
import { EntityClass, PrimaryType } from "@src/helpers/enums";

const getMasterCompany = async (options: { client: PoolClient, criteria: { includeIds: number[] } }) => {
    const { client, criteria: { includeIds } } = options;
    const { keys: columns } = useInsertTemplate(new MasterCompanyRecord().getValues());
    return selectEntities(columns, {
        client,
        criteria: {
            includeIds,
            entityClass: EntityClass.MASTER,
            entityTypePrimary: PrimaryType.COMPANY
        }
    })
}

const getMasterPeople = async (options: { client: PoolClient, criteria: { includeIds: number[] } }) => {
    const { client, criteria: { includeIds } } = options;
    const { keys: columns } = useInsertTemplate(new MasterPersonRecord().getValues());
    return selectEntities(columns, {
        client,
        criteria: {
            includeIds,
            entityClass: EntityClass.MASTER,
            entityTypePrimary: PrimaryType.PERSONAL
        }
    })
}

const getClientCompanies = async (options: { client: PoolClient, criteria: { includeIds: number[] } }) => {
    const { client, criteria: { includeIds } } = options;
    const { keys: columns } = useInsertTemplate(new ClientCompanyRecord().getValues());
    return selectEntities(columns, {
        client,
        criteria: {
            includeIds,
            entityClass: EntityClass.CLIENT,
            entityTypePrimary: PrimaryType.COMPANY
        }
    })
}

const getClientPeople = async (options: { client: PoolClient, criteria: { includeIds: number[] } }) => {
    const { client, criteria: { includeIds } } = options;
    const { keys: columns } = useInsertTemplate(new ClientPersonRecord().getValues());
    return selectEntities(columns, {
        client,
        criteria: {
            includeIds,
            entityClass: EntityClass.CLIENT,
            entityTypePrimary: PrimaryType.PERSONAL
        }
    })
}

const getServiceProviderCompanies = async (options: { client: PoolClient, criteria: { includeIds: number[] } }) => {
    const { client, criteria: { includeIds } } = options;
    const { keys: columns } = useInsertTemplate(new ServiceProviderCompanyRecord().getValues());
    return selectEntities(columns, {
        client,
        criteria: {
            includeIds,
            entityClass: EntityClass.SERVICE_PROVIDER,
            entityTypePrimary: PrimaryType.COMPANY
        }
    })
}

const getServiceProviderPeople = async (options: { client: PoolClient, criteria: { includeIds: number[] } }) => {
    const { client, criteria: { includeIds } } = options;
    const { keys: columns } = useInsertTemplate(new ServiceProviderPersonRecord().getValues());
    return selectEntities(columns, {
        client,
        criteria: {
            includeIds,
            entityClass: EntityClass.SERVICE_PROVIDER,
            entityTypePrimary: PrimaryType.PERSONAL
        }
    })
}

export const getEntities = async (options: { client: PoolClient, criteria: { includeIds: number[] } }) => {
    const [clientCompany, clientPerson, spCompany, spPerson] = await Promise.all([
        getClientCompanies(options),
        getClientPeople(options),
        getServiceProviderCompanies(options),
        getServiceProviderPeople(options),
    ]);
    return {
        clientCompany,
        clientPerson,
        spCompany,
        spPerson,
    }
}
