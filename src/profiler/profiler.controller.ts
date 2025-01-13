import { wrapTask } from "@src/db/PgHelpers"
import { EntityType } from "@src/helpers/enums";
import { wrapCatcher } from "@src/helpers/middlewares";
import { EntityModelManager } from "./domain/EntityModels";
import { getEntities } from "./entity.service"
import { insertEntity, updateEntity } from "./entity.repository";
import { RequestHandler, Router } from "express"
import { RelationTypeModel } from "./domain/RelationType";
import { selectRelationTypes, upsertRelationType } from "./relationTypes.repository";

export const registerProfiler = (router: Router) => {
    router.get("/entities", wrapCatcher(getEntitiesRoute));
    router.get("/entities/:ids", wrapCatcher(getEntitiesByIdRoute));

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

    // NOTE: 
    router.get("/relation-type", wrapCatcher(getRelationTypes));
    router.post("/relation-type", wrapCatcher(postRelationType));
    // router.post("/master/company/:parentId/employee-employer/:childId", upsertRelation);

    /*
    router.post("/client/company/:parentId/:relationType", createMasterCo);
    router.patch("/client/company/:parentId/relation/:childId", patchMasterCo);

    router.post("/service-provider/company/:parentId/:relationType", createMasterCo);
    router.patch("/service-provider/company/:parentId/relation/:childId", patchMasterCo);
    */
}

// SECTION: creation block
const createEntityRoute = (entityType: EntityType): RequestHandler => async (req, resp, next) => {
    const data = req.body;
    const { instance } = new EntityModelManager(entityType);
    instance.validate(data);
    instance.fromDto(data, 0);

    const payload = await wrapTask(`insert wrapper for ${entityType}`, (client) => {
        return insertEntity(entityType, instance.getValues(), { client })
    })

    resp.json({ payload });
}

const patchEntityRoute = (entityType: EntityType): RequestHandler => async (req, resp, next) => {
    const { id } = req.params;
    const data = req.body;
    const entityId = Number(id);

    const { instance } = new EntityModelManager(EntityType.SERVICE_PROVIDER_PERSON);
    instance.validate(data);
    instance.fromDto(req.body, entityId);

    const payload = await wrapTask(`patch wraper for ${entityType}`, (client) => {
        return updateEntity(EntityType.SERVICE_PROVIDER_PERSON, data, { client, criteria: { entityId } })
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

// SECTION: relation-type
const postRelationType: RequestHandler = async (req, resp, next) => {
    const data = req.body;
    const payload = await wrapTask("upsert relation type", async (client) => {
        const r = new RelationTypeModel()
        r.fromDto(data);
        return upsertRelationType(r, { client })
    })
    resp.json({ payload });
}

const getRelationTypes: RequestHandler = async (req, resp, next) => {
    const payload = await wrapTask("get relation type", async (client) => {
        return selectRelationTypes({ client })
    })
    resp.json({ payload });
}