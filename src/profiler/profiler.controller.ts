import { wrapTask } from "@src/db/PgHelpers"
import { EntityModelManager } from "./domain/EntityModels";
import { getEntities } from "./entity.service"
import { insertEntity, updateEntity } from "./entity.repository";
import { RequestHandler, Router } from "express"
import { EntityType } from "@src/helpers/enums";

export const registerProfiler = (router: Router) => {
    router.get("/entities", getEntitiesRoute);
    router.get("/entities/:ids", getEntitiesByIdRoute);

    // NOTE: creation
    router.post("/master/company", createMasterCo);
    router.post("/master/person", createMasterPerson);
    router.post("/client/company", createClientCo);
    router.post("/client/person", createClientPerson);
    router.post("/service-provider/company", createSPCo);
    router.post("/service-provider/person", createSPPerson);

    // NOTE: patch 
    router.patch("/master/company/:id", patchMasterCo);
    router.patch("/master/person/:id", patchMasterPerson);
    router.patch("/client/company/:id", patchClientCo);
    router.patch("/client/person/:id", patchClientPerson);
    router.patch("/service-provider/company/:id", patchSPCo);
    router.patch("/service-provider/person/:id", patchSPPerson);
}

// SECTION: creation block
const createMasterCo: RequestHandler = async (req, resp, next) => {
    const { instance } = new EntityModelManager(EntityType.MASTER_COMPANY);
    instance.fromDto(req.body, 0);

    const payload = await wrapTask(`create master company`, (client) => {
        return insertEntity(instance.getValues(), { client })
    })

    resp.json({ payload });
}

const createMasterPerson: RequestHandler = async (req, resp, next) => {
    const { instance } = new EntityModelManager(EntityType.MASTER_PERSON);
    instance.fromDto(req.body, 0);

    const payload = await wrapTask(`create master person`, (client) => {
        return insertEntity(instance.getValues(), { client })
    })

    resp.json({ payload });
}

const createClientCo: RequestHandler = async (req, resp, next) => {
    const { instance } = new EntityModelManager(EntityType.CLIENT_COMPANY);
    instance.fromDto(req.body, 0);

    const payload = await wrapTask(`create client company`, (client) => {
        return insertEntity(instance.getValues(), { client })
    })

    resp.json({ payload });
}

const createClientPerson: RequestHandler = async (req, resp, next) => {
    const { instance } = new EntityModelManager(EntityType.CLIENT_PERSON);
    instance.fromDto(req.body, 0);

    const payload = await wrapTask(`create service provider person`, (client) => {
        return insertEntity(instance.getValues(), { client })
    })

    resp.json({ payload });
}

const createSPCo: RequestHandler = async (req, resp, next) => {
    const { instance } = new EntityModelManager(EntityType.SERVICE_PROVIDER_COMPANY);
    instance.fromDto(req.body, 0);

    const payload = await wrapTask(`create service provider company`, (client) => {
        return insertEntity(instance.getValues(), { client })
    })

    resp.json({ payload });
}

const createSPPerson: RequestHandler = async (req, resp, next) => {
    const { instance } = new EntityModelManager(EntityType.SERVICE_PROVIDER_PERSON);
    instance.fromDto(req.body, 0);

    const payload = await wrapTask(`create service provider person`, (client) => {
        return insertEntity(instance.getValues(), { client })
    })

    resp.json({ payload });
}

// SECTION: update block
const patchMasterCo: RequestHandler = async (req, resp, next) => {
    const { id } = req.params; 
    const { instance } = new EntityModelManager(EntityType.MASTER_COMPANY);
    instance.fromDto(req.body, Number(id));

    const payload = await wrapTask(`patch master company`, (client) => {
        return updateEntity(instance.getValues(), { client })
    })

    resp.json({ payload });
}

const patchMasterPerson: RequestHandler = async (req, resp, next) => {
    const { id } = req.params; 
    const { instance } = new EntityModelManager(EntityType.MASTER_PERSON);
    instance.fromDto(req.body, Number(id));

    const payload = await wrapTask(`patch master person`, (client) => {
        return updateEntity(instance.getValues(), { client })
    })

    resp.json({ payload });
}

const patchClientCo: RequestHandler = async (req, resp, next) => {
    const { id } = req.params; 
    const { instance } = new EntityModelManager(EntityType.CLIENT_COMPANY);
    instance.fromDto(req.body, Number(id));

    const payload = await wrapTask(`patch client company`, (client) => {
        return updateEntity(instance.getValues(), { client })
    })

    resp.json({ payload });
}

const patchClientPerson: RequestHandler = async (req, resp, next) => {
    const { id } = req.params; 
    const { instance } = new EntityModelManager(EntityType.CLIENT_PERSON);
    instance.fromDto(req.body, Number(id));

    const payload = await wrapTask(`patch service provider person`, (client) => {
        return updateEntity(instance.getValues(), { client })
    })

    resp.json({ payload });
}

const patchSPCo: RequestHandler = async (req, resp, next) => {
    const { id } = req.params; 
    const { instance } = new EntityModelManager(EntityType.SERVICE_PROVIDER_COMPANY);
    instance.fromDto(req.body, Number(id));

    const payload = await wrapTask(`patch service provider company`, (client) => {
        return updateEntity(instance.getValues(), { client })
    })

    resp.json({ payload });
}

const patchSPPerson: RequestHandler = async (req, resp, next) => {
    const { id } = req.params; 
    const { instance } = new EntityModelManager(EntityType.SERVICE_PROVIDER_PERSON);
    instance.fromDto(req.body, Number(id));

    const payload = await wrapTask(`patch service provider person`, (client) => {
        return updateEntity(instance.getValues(), { client })
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
