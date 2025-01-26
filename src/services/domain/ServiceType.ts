import { HttpBadRequest } from "@src/errors/HttpError";
import { NullableString } from "@src/helpers/interfaces";
import { logger } from "@src/logger";
import { z } from "zod";

export const ServiceTypeSchema = z.object({
    serviceTypeId: z.number(), 
    serviceTypeName: z.string(),
    serviceTypeDescription: z.string().nullable().optional(),
    serviceTypeGrouping: z.string().nullable().optional(),
    serviceTypeDeadlines: z.array(z.string()).optional(),
})

export type ServiceTypeSchema = z.infer<typeof ServiceTypeSchema>;

export interface IServiceTypeSchema {
    serviceTypeId: number,
    serviceTypeName: string,
    serviceTypeDescription: NullableString,
    serviceTypeGrouping: NullableString,
    serviceTypeDeadlines: string[],
}

export const serviceTypeFromDto = (dto: ServiceTypeSchema) => {
    try {
        ServiceTypeSchema.parse(dto);
    } catch(err) {
        logger.warn(err, "Service type validation error.");
        throw new HttpBadRequest("Service type validation error.");
    }
    return dto as IServiceTypeSchema;
}