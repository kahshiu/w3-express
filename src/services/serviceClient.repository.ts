import { PoolClient } from "pg";
import { IServiceClient } from "./domain/ServiceClients";
import { selectTemplate, upsertTemplate } from "@src/db/templates";
import { logger } from "@src/logger";
import { pick } from "es-toolkit/compat";

export const insertServiceClient = async (data: IServiceClient, options: { client: PoolClient }) => {
    const { client } = options;

    data.serviceCreatedBy = 1; // TODO: replace when auth is ready
    data.serviceCreatedDate = new Date();

    const frags = upsertTemplate(data);
    const columns = frags.map(({ column }) => column).join(",")
    const placeholders = frags.map(({ placeholder }) => placeholder).join(",")
    const values = frags.map(({ value }) => value)

    logger.info({ columns, placeholders, values }, "tracing sql: insert client service")
    const records = await client.query({
        text:
            `insert into my_way2.client_services (
                ${columns}
            ) values (
                ${placeholders}
            ) returning service_id
                , service_created_by
                , service_created_date
                , service_status
                , entity_id
                , service_type_id
                , default_internal_provider_id
                , default_external_provider_id
                , remarks
            `,
        values,
    })
    const models = records.rows.map((row) => selectTemplate(row));
    return models;
}

export const updateServiceClient = async (
    data: IServiceClient,
    options: {
        client: PoolClient,
        criteria: {
            serviceId: number,
            entityId: number,
            serviceTypeId: number,
        }
    }) => {
    const { client, criteria: { serviceId, entityId, serviceTypeId } } = options;

    const excludeColumns = [
        "serviceStatus", 
        "defaultInternalProviderId", 
        "defaultExternalProviderId",
        "remarks",
    ];
    const updateData = pick(data, excludeColumns)
    const frags = upsertTemplate(updateData);
    const placeholders = frags.map(({ placeholder }) => placeholder).join(",")
    const values = frags.map(({ value }) => value)

    const whereArr: string[] = [];
    whereArr.push(`entity_id = ${entityId}`)
    whereArr.push(`service_type_id = ${serviceTypeId}`)
    if (serviceId && serviceId > 0) {
        whereArr.push(`serviceId = ${serviceId}`)
    }
    const whereClause = whereArr.length > 0 ? `where ${whereArr.join(" and ")}` : "";

    logger.info({ placeholders, values }, "tracing sql: update client service")
    const records = await client.query({
        text:
            `update my_way2.client_services set ${placeholders}
                ${whereClause}
            returning service_id
                , service_status
                , entity_id
                , service_type_id
                , default_internal_provider_id
                , default_external_provider_id
                , remarks
            `,
        values,
    })
    const models = records.rows.map((row) => selectTemplate(row));
    return models;
}