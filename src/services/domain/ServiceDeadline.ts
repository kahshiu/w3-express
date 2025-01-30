import { HttpBadRequest } from "@src/errors/HttpError";
import { IntervalSchema } from "@src/helpers/common/IInterval";
import { logger } from "@src/logger";
import { z } from "zod";

export const ServiceDeadlineSchema = z.object({
    deadlineId: z.number(),
    deadlineName: z.string(),
    dateStart: z.string(),
    intervalAdded: IntervalSchema,
})

export type ServiceDeadlineSchema = z.infer<typeof ServiceDeadlineSchema>;

export interface IServiceDeadline {
    deadlineId: number,
    deadlineName: string,
    dateStart: string,
    intervalAdded: IntervalSchema,
    serviceTypeId: number,
}

export const serviceDeadlineFromDto = (input: ServiceDeadlineSchema, serviceTypeId: number) => {
    try {
        ServiceDeadlineSchema.parse(input);
    } catch (err) {
        logger.warn(err, "Service deadline validation error.");
        throw new HttpBadRequest("Service deadline validation error.");
    }
    return {
        ...input,
        serviceTypeId,
    } as IServiceDeadline
}