import { HttpBadRequest } from "@src/errors/HttpError";
import { Remark, RemarkSchema } from "@src/helpers/common/IRemark"
import { ClientServiceTaskStatus } from "@src/helpers/enums"
import { logger } from "@src/logger";
import { z } from "zod"
import { selectTaskCustomColumns } from "../tasks.repository";
import { wrapTask } from "@src/db/PgHelpers";
import { ColumnDefinition, ColumnTypes } from "./ColumnTypes";
import { fromColumnName } from "@src/db/templates";

export const ServiceTaskInsertKeysSchema = z.object({
    taskId: z.number().optional(),
    taskYear: z.number(),
    entityId: z.number(),
    serviceId: z.number(),
})

export const ServiceTaskUpdateKeysSchema = z.object({
    taskId: z.number().optional(),
    entityId: z.number(),
})

export const ServiceTaskColsSchema = z.object({
    taskStatus: z.nativeEnum(ClientServiceTaskStatus),
    remarks: z.array(RemarkSchema),

    serviceInternalProviderId: z.number(),
    serviceExternalProviderId: z.number(),
    workflowHistory: z.object({}),
    workflowCurrent: z.object({}),
})

export const ServiceTaskInsertSchema = ServiceTaskUpdateKeysSchema.merge(ServiceTaskColsSchema)
export const ServiceTaskUpdateSchema = ServiceTaskUpdateKeysSchema.merge(ServiceTaskColsSchema)

export type ServiceTaskInsertSchema = z.infer<typeof ServiceTaskInsertSchema>;
export type ServiceTaskUpdateSchema = z.infer<typeof ServiceTaskUpdateSchema>;

export interface IServiceTaskSchema {
    taskId: number;
    taskYear: number;
    taskStatus: number;
    remarks: Remark[];
    entityId: number;
    serviceId: number;
    serviceTypeId: number;
    serviceName: string;

    serviceInternalProviderId: number;
    serviceExternalProviderId: number;
    workflowHistory: object,
    workflowCurrent: object,
}

export const serviceTaskFromInsertDto = async (
    dto: any,
    entityId: number,
    taskId: number = 0
) => {
    const target = {
        ...dto,
        entityId,
        taskId,
    } as any
    try {
        ServiceTaskInsertSchema.parse(target);
    } catch (err) {
        logger.warn(err, "Service task validation error.");
        throw new HttpBadRequest("Service task validation error.");
    }

    const columns = await wrapTask(`get custom columns`, (client) => {
        return selectTaskCustomColumns({
            client,
            criteria: { dataTypes: [] }
        })
    })

    const columnsTyped = columns as ColumnDefinition[];
    columnsTyped.forEach((col) => {
        const { columnName, dataType, udtName } = col

        const camelCased = fromColumnName(columnName);
        const datum = target[camelCased];
        if (!datum) return;

        // apply transformation only to known fields
        if (udtName === "timestamptz") {
            target[camelCased] = new Date(target[camelCased]);
        }
    })

    return target;
}

export const serviceTaskFromUpdateDto = async (
    dto: any,
    entityId: number,
    taskId: number = 0
) => {
    const target = {
        ...dto,
        entityId,
        taskId,
    } as any
    try {
        ServiceTaskUpdateSchema.parse(target);
    } catch (err) {
        logger.warn(err, "Service task validation error.");
        throw new HttpBadRequest("Service task validation error.");
    }

    const columns = await wrapTask(`get custom columns`, (client) => {
        return selectTaskCustomColumns({
            client,
            criteria: { dataTypes: [] }
        })
    })

    const columnsTyped = columns as ColumnDefinition[];
    columnsTyped.forEach((col) => {
        const { columnName, dataType, udtName } = col

        const camelCased = fromColumnName(columnName);
        const datum = target[camelCased];
        if (!datum) return;

        // apply transformation only to known fields
        if (udtName === "timestamptz") {
            target[camelCased] = new Date(target[camelCased]);
        }
    })

    return target;
}