import { PoolClient } from "pg"
import { upsertServiceType } from "./serviceTypes.repository"
import { IServiceTypeSchema } from "./domain/ServiceType"

export const modifyServiceType = (
    data: IServiceTypeSchema,
    options: { client: PoolClient },
) => {
    return upsertServiceType(data, options)
}