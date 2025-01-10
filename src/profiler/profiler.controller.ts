import { wrapTask } from "@src/db/PgHelpers"
import { ServiceProviderCompanyModel } from "./domain/ServiceProviders";
import { getEntities } from "./entity.service"
import { insertEntity, updateEntity } from "./entity.repository";
import { RequestHandler, Router } from "express"
import { EntityType } from "@src/helpers/enums";

export const registerProfiler = (router: Router) => {
    router.get("/entities", getEntitiesRoute);
    router.get("/entities/:ids", getEntitiesByIdRoute);
    router.post("/service-providers/company", createSPCompanyRoute);
    // router.patch("/service-providers/company", updateSPCompanyRoute);
    router.post("/service-providers/person", getEntitiesByIdRoute);
    router.post("/client/company", getEntitiesByIdRoute);
    router.post("/client/person", getEntitiesByIdRoute);
}

const getEntitiesRoute: RequestHandler = async (req, resp, next) => {
    const payload = await wrapTask("select entity", async (client) => {
        return getEntities({ client, criteria: { includeIds: [] } })
    })
    resp.json({ payload });
}

const getEntitiesByIdRoute: RequestHandler = async (req, resp, next) => {
    const { ids } = req.params;
    const payload = await wrapTask("select entity", async (client) => {
        const includeIds = (ids ?? "").split(",").map(Number);
        return getEntities({ client, criteria: { includeIds } })
    })

    resp.json({ payload });
}

const createSPCompanyRoute: RequestHandler = async (req, resp, next) => {
    const spCo = new ServiceProviderCompanyModel()
    spCo.fromDto(req.body, 0);

    const payload = await wrapTask("create service provider", (client) => {
        return insertEntity(spCo.getValues(), { client })
    })

    resp.json({ payload });
}

const updateEntitiesRoute = (entityType: EntityType) => {
    const fn: RequestHandler = async (req, resp, next) => {

        if (entityType === EntityType.MASTER_COMPANY) {
        } else if (entityType === EntityType.MASTER_PERSON) {
        } else if (entityType === EntityType.SERVICE_PROVIDER_COMPANY) {
        } else if (entityType === EntityType.SERVICE_PROVIDER_PERSON) {
        } else if (entityType === EntityType.CLIENT_COMPANY) {
        } else if (entityType === EntityType.CLIENT_PERSON) {
        }

        const dto = req.body;
        const entityId = Number(req.params.id) ?? 0;

        // TODO: validate data
        // TODO: throw HTTP error properly
        if (entityId <= 0) resp.json({ error: "something wrong" })

        const spCo = new ServiceProviderCompanyModel();
        spCo.fromDto(dto, entityId);

        const payload = await wrapTask("create service provider", (client) => {
            return updateEntity(spCo.getValues(), { client })
        })

        resp.json({ payload });
    }
    return fn;
}