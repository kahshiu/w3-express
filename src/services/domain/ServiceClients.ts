import { HttpBadRequest } from "@src/errors/HttpError";
import { Remark, RemarkSchema } from "@src/helpers/common/IRemark";
import { ClientServiceStatus } from "@src/helpers/enums";
import { logger } from "@src/logger";
import { z } from "zod";

export const ServiceClientSchema = z.object({
    serviceId: z.number().optional(),
    serviceCreatedBy: z.number().optional(),
    serviceCreatedDate: z.string().datetime().optional(),
    entityId: z.number().optional(),
    serviceTypeId: z.number().optional(),
    serviceStatus: z.nativeEnum(ClientServiceStatus),
    defaultInternalProviderId: z.number(),
    defaultExternalProviderId: z.number(),
    remarks: z.array(RemarkSchema),
})

export const ServiceClientSchemaArray = z.array(ServiceClientSchema);

// 1 client, multi services
export const ClientServices = z.array(
    ServiceClientSchema.merge(
        z.object({
            serviceTypeId: z.number(),
        })
    )
)

// 1 service, multi clients
export const ServiceClients = z.array(
    ServiceClientSchema.merge(
        z.object({
            entityId: z.number(),
        })
    )
)

export type ClientServicesDto = z.infer<typeof ClientServices>;
export type ServiceClientsDto = z.infer<typeof ServiceClients>;

export interface IServiceClient {
    serviceId: number,
    serviceCreatedBy?: number,
    serviceCreatedDate?: Date,
    serviceStatus: number,
    entityId: number,
    serviceTypeId: number,
    defaultInternalProviderId: number,
    defaultExternalProviderId: number,
    remarks: Remark[],
}

export const serviceClientFromDto = (
    input: ClientServicesDto | ServiceClientsDto,
    options: { entityId?: number, serviceTypeId?: number }
) => {
    try {
        ServiceClientSchemaArray.parse(input);
    } catch (err) {
        logger.warn(err, "Service client validation error.");
        throw new HttpBadRequest("Service client validation error.");
    }
    const { entityId, serviceTypeId } = options;
    const dto = input.map((i) => ({ entityId, serviceTypeId, ...i }));
    return dto as IServiceClient[];
}