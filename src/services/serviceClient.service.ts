import { PoolClient } from "pg"
import { insertServiceClient, updateServiceClient } from "./serviceClient.repository"
import { ClientServicesDto, serviceClientFromDto } from "./domain/ServiceClients"
import { logger } from "@src/logger";
import { HttpServerError } from "@src/errors/HttpError";

export const createServiceClient = async (
    data: ClientServicesDto,
    options: {
        client: PoolClient,
        entityId?: number,
        serviceTypeId?: number,
    },
) => {
    const arr = serviceClientFromDto(data, options);
    try {
        const promises = arr.map((a) => {
            return insertServiceClient(a, options);
        })
        const results = await Promise.allSettled(promises);
        const successfulPromises = results
            .filter(result => result.status === 'fulfilled')
            .map(result => result.value);
        return successfulPromises.flat();

    } catch (err) {
        logger.error("promise for errors");
        throw new HttpServerError("error at creating client services")
    }
}

export const modifyServiceClient = async (
    data: ClientServicesDto,
    options: {
        client: PoolClient,
        entityId?: number,
        serviceTypeId?: number,
    },
) => {
    const { client } = options;
    const arr = serviceClientFromDto(data, options);
    const promises = arr.map((a) => {
        return updateServiceClient(a, {
            client,
            criteria: {
                serviceId: a.serviceId,
                entityId: a.entityId,
                serviceTypeId: a.serviceTypeId,
            }
        });
    })
    try {
        const results = await Promise.allSettled(promises);
        const successfulPromises = results
            .filter(result => result.status === 'fulfilled')
            .map(result => result.value);
        return successfulPromises;

    } catch (err) {
        logger.error("promise for errors");
        throw new HttpServerError("error at updating client services")
    }
}