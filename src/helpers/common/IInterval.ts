import { HttpBadRequest } from "@src/errors/HttpError";
import { logger } from "@src/logger";
import PostgresInterval from "postgres-interval";
import { z } from "zod";

export const IntervalSchema = z.object({
    years: z.number().optional(),
    months: z.number().optional(),
    days: z.number().optional(),
    hours: z.number().optional(),
    minutes: z.number().optional(),
    seconds: z.number().optional(),
})

export type IntervalSchema = z.infer<typeof IntervalSchema>;

export const intervalToColumn = (dto: IntervalSchema) => {
    try {
        IntervalSchema.parse(dto)
    } catch (err) {
        logger.warn(err, "Service type validation error.");
        throw new HttpBadRequest("Service type validation error.");
    }

    const years = dto.years ?? 0;
    const months = dto.months ?? 0;
    const days = dto.days ?? 0;
    const hours = dto.hours ?? 0;
    const minutes = dto.minutes ?? 0;
    const seconds = dto.seconds ?? 0;

    const hStr = hours.toString().padStart(2, "0");
    const mStr = minutes.toString().padStart(2, "0");
    const sStr = seconds.toString().padStart(2, "0");

    const str = `${years.toString()} years ${months.toString()} months ${days.toString()} days ${hStr}:${mStr}:${sStr}`
    return PostgresInterval(str).toPostgres();
}

export const intervalFromColumn = (model: PostgresInterval.IPostgresInterval) => {
    return {
        years: model.years,
        months: model.months,
        days: model.days,
        hours: model.hours,
        minutes: model.minutes,
        seconds: model.seconds,
    }
}