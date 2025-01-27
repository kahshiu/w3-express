import { PoolClient } from "pg"
import { upsertServiceType } from "./serviceTypes.repository"
import { IServiceType, serviceTypeFromDto, ServiceTypeSchema } from "./domain/ServiceType"
import { IServiceDeadline, serviceDeadlineFromDto } from "./domain/ServiceDeadline"
import { getServiceDeadlines, deleteServiceDeadlines, upsertServiceDeadline } from "./serviceDeadlines.repository"
import { HttpServerError } from "@src/errors/HttpError"
import { logger } from "@src/logger"
import { intervalFromColumn, intervalToColumn } from "@src/helpers/common/IInterval"
import { createTaskColumn, removeTaskColumn } from "@src/tasks/tasks.service"

export const modifyEntireServiceType = async (
    dto: ServiceTypeSchema,
    options: { client: PoolClient },
) => {
    // NOTE: service type
    const serviceTypeModel = serviceTypeFromDto(dto);
    const serviceType = await modifyServiceType(serviceTypeModel, options);
    const firstServiceType = serviceType[0];
    const { serviceTypeId } = firstServiceType;
    // logger.info(firstServiceType, "tracing service type");
    // logger.info(dto.deadlines, "tracing target deadlines");

    // NOTE: old set of deadlines
    const dlSetNew = dto.deadlines.map((d) => serviceDeadlineFromDto(d, serviceTypeId));
    const dlSetNewIds = dlSetNew.map((d) => d.deadlineId as number);
    const dlSetOld = await getServiceDeadlines(serviceTypeId, options);
    const dlSetOldIds = dlSetOld.map((d) => d.deadlineId as number);

    // NOTE: remove partial old set of deadlines
    const dlSetOldRemove = dlSetOld.filter((d) => !dlSetNewIds.includes(d.deadlineId));
    const dlSetToAdd = dlSetNew.filter((d) => !dlSetOldIds.includes(d.deadlineId));
    const dlSetToUpdate = dlSetNew.filter((d) => dlSetOldIds.includes(d.deadlineId));
    // logger.info({ dlSetNew, dlSetNewIds }, "tracing set new");
    // logger.info({ dlSetOld, dlSetOldIds }, "tracing set old");

    logger.info(dlSetOldRemove, "tracing set to remove");
    logger.info(dlSetToAdd, "tracing set to add");
    logger.info(dlSetToUpdate, "tracing set to update");

    if (dlSetOldRemove.length > 0) {
        await removeDeadlines(serviceTypeId, dlSetOldRemove as IServiceDeadline[], options);
    }

    let dlMod: IServiceDeadline[] = [];
    if (dlSetToAdd.length > 0 || dlSetToUpdate.length > 0) {
        dlMod = await modifyServiceDeadlines(dlSetToAdd, dlSetToUpdate, options);
    }

    return { ...firstServiceType, deadlines: dlMod }
}

export const modifyServiceType = (
    data: IServiceType,
    options: { client: PoolClient },
) => {
    return upsertServiceType(data, options)
}

export const modifyServiceDeadlines = async (
    deadlinesToAdd: IServiceDeadline[],
    deadlinesToUpdate: IServiceDeadline[],
    options: { client: PoolClient },
) => {
    try {
        const addPromises = deadlinesToAdd.map((d) => createTaskColumn(d.deadlineName, "timestamptz", options));
        await Promise.all(addPromises);

        const promises = [...deadlinesToAdd, ...deadlinesToUpdate].map((d) => {
            const d2 = {
                ...d,
                intervalAdded: intervalToColumn(d.intervalAdded)
            } as IServiceDeadline
            return upsertServiceDeadline(d2, options)
        })

        const results = await Promise.allSettled(promises);
        const rejectedPromises = results
            .filter(result => result.status === 'rejected')
        logger.info(rejectedPromises, "tracing rejected")

        const successfulPromises = results
            .filter(result => result.status === 'fulfilled')
            .map(result => result.value)
            .flat()
            .map(d => {
                const intervalAdded = intervalFromColumn(d.intervalAdded);
                return {
                    ...d,
                    intervalAdded
                } as IServiceDeadline;
            })
        return successfulPromises;

    } catch (err) {
        logger.error(err, "deadline promise hit errors");
        throw new HttpServerError("error at creating service deadlines")
    }
}

export const removeDeadlines = async (
    serviceTypeId: number,
    deadlines: IServiceDeadline[],
    options: { client: PoolClient },
) => {
    const deadlineIds = deadlines.map((d) => d.deadlineId);
    const deadlineNames = deadlines.map((d) => d.deadlineName);

    await deleteServiceDeadlines(serviceTypeId, deadlineIds, options);
    const removePromises = deadlineNames.map((d) => removeTaskColumn(d, options));
    await Promise.all(removePromises);
}