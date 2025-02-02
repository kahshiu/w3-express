import { wrapTask, wrapTrx } from "@src/db/PgHelpers"
import { EntityType } from "@src/helpers/enums";
import { wrapCatcher } from "@src/helpers/middlewares";
import { logger } from "@src/logger";
import { IRelationTypeModel, relationTypeFromDto } from "./domain/RelationType";
import { getEntities, createEntity, modifyEntity, determineEntityType } from "./entity.service";
import { selectRelationTypes, upsertRelationType } from "./relationTypes.repository";
import { RequestHandler, Router } from "express"
import { deleteEntityRelations } from "./entityRelations.repository";
import { HttpClientUnprocessableContent } from "@src/errors/HttpError";
import { patchServiceClients, postServiceClients } from "@src/services/services.controller";
import { postTask, patchTask } from "@src/tasks/tasks.controller";
import { IEntityDto } from "./domain/entity/IDto";

export const registerProfiler = (router: Router) => {
    router.get("/entities", wrapCatcher(getEntitiesRoute));
    router.get("/entities/:ids", wrapCatcher(getEntitiesByIdRoute));
    router.post("/entity", wrapCatcher(createEntityBase));
    router.patch("/entity/:id", wrapCatcher(patchEntityBase));

    // NOTE: creation
    router.post("/master/company", wrapCatcher(createEntityRoute(EntityType.MASTER_COMPANY)));
    router.post("/master/person", wrapCatcher(createEntityRoute(EntityType.MASTER_PERSON)));
    router.post("/client/company", wrapCatcher(createEntityRoute(EntityType.CLIENT_COMPANY)));
    router.post("/client/person", wrapCatcher(createEntityRoute(EntityType.CLIENT_PERSON)));
    router.post("/service-provider/company", wrapCatcher(createEntityRoute(EntityType.SERVICE_PROVIDER_COMPANY)));
    router.post("/service-provider/person", wrapCatcher(createEntityRoute(EntityType.SERVICE_PROVIDER_PERSON)));

    // NOTE: patch 
    router.patch("/master/company/:id", wrapCatcher(patchEntityRoute(EntityType.MASTER_COMPANY)));
    router.patch("/master/person/:id", wrapCatcher(patchEntityRoute(EntityType.MASTER_PERSON)));
    router.patch("/client/company/:id", wrapCatcher(patchEntityRoute(EntityType.CLIENT_COMPANY)));
    router.patch("/client/person/:id", wrapCatcher(patchEntityRoute(EntityType.CLIENT_PERSON)));
    router.patch("/service-provider/company/:id", wrapCatcher(patchEntityRoute(EntityType.SERVICE_PROVIDER_COMPANY)));
    router.patch("/service-provider/person/:id", wrapCatcher(patchEntityRoute(EntityType.SERVICE_PROVIDER_PERSON)));

    // NOTE: relations types
    router.get("/relation-type", wrapCatcher(getRelationTypes));
    router.post("/relation-type", wrapCatcher(postRelationType));
    router.delete("/relation/:pid-:cid", wrapCatcher(removeEntityRelationRoute));

    // NOTE: services
    router.post("/client/:entityId/services", wrapCatcher(postServiceClients));
    router.patch("/client/:entityId/services", wrapCatcher(patchServiceClients));

    router.post("/client/:entityId/tasks", wrapCatcher(postTask));
    router.patch("/client/:entityId/tasks/:taskId", wrapCatcher(patchTask));
}

// SECTION: creation block
const createEntityBase: RequestHandler = async (req, resp, next) => {
    const dto = req.body as IEntityDto;
    const entityType = determineEntityType(dto) as EntityType;
    const payload = await wrapTrx(`insert wrapper for ${entityType}`, async (client) => {
        const data = await createEntity(entityType, dto, { client });
        return data;
    })
    resp.json({ payload });
}

const patchEntityBase: RequestHandler = async (req, resp, next) => {
    const { id } = req.params;
    const data = req.body;
    const entityId = Number(id);
    const entityType = determineEntityType(data) as EntityType;

    const payload = await wrapTrx(`patch wraper for ${entityType}`, (client) => {
        return modifyEntity(entityType, { ...data, entityId }, { client })
    })

    resp.json({ payload });
}

const createEntityRoute = (entityType: EntityType): RequestHandler => async (req, resp, next) => {
    const dto = req.body;

    const payload = await wrapTrx(`insert wrapper for ${entityType}`, async (client) => {
        return createEntity(entityType, dto, { client });
    })
    resp.json({ payload });
}

const patchEntityRoute = (entityType: EntityType): RequestHandler => async (req, resp, next) => {
    const { id } = req.params;
    const data = req.body;
    const entityId = Number(id);

    const payload = await wrapTrx(`patch wraper for ${entityType}`, (client) => {
        return modifyEntity(entityType, { ...data, entityId }, { client })
    })

    resp.json({ payload });
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

const removeEntityRelationRoute: RequestHandler = async (req, resp, next) => {
    const { pid, cid } = req.params;
    const deletedCount = await wrapTask("remove entity relation", async (client) => {
        return deleteEntityRelations(Number(pid), Number(cid), { client });
    })
    resp.statusCode = 204
    resp.statusMessage = "Relationship soft-deleted"

    if (deletedCount === 0) {
        resp.statusCode = 404
        resp.statusMessage = "Relationship Not found"
    }
    resp.end();
}

// SECTION: relation-type
const postRelationType: RequestHandler = async (req, resp, next) => {
    const dto = req.body;
    const payload = await wrapTask("upsert relation type", async (client) => {
        const model = relationTypeFromDto(dto as IRelationTypeModel);
        if (model.relationId <= 0) {
            throw new HttpClientUnprocessableContent("Validation Error: Invalid relationId")
        }
        return upsertRelationType(model, { client })
    })
    resp.json({ payload });
}

const getRelationTypes: RequestHandler = async (req, resp, next) => {
    const payload = await wrapTask("get relation type", async (client) => {
        return selectRelationTypes({ client })
    })
    resp.json({ payload });
}