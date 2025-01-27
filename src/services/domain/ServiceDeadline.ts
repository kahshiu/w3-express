import { IntervalSchema } from "@src/helpers/common/IInterval";
import PostgresInterval from "postgres-interval";
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

export const serviceDeadlineFromDto = (dto: ServiceDeadlineSchema, serviceTypeId: number) => {
    return {
        ...dto,
        serviceTypeId,
    } as IServiceDeadline
}