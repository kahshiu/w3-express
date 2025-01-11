import { wrapTask } from "@src/db/PgHelpers"
import { EntityModelManager } from "./domain/EntityModels";
import { getEntities } from "./entity.service"
import { insertEntity, updateEntity } from "./entity.repository";
import { RequestHandler, Router } from "express"
import { EntityClass, EntityType, PrimaryType } from "@src/helpers/enums";

const wrapCatcher = (fn: RequestHandler) => {
    const errorCatcher: RequestHandler = async (req, resp, next) => {
        try {
            await fn(req, resp, next);
        } catch (error) {
            next(error)
        }
    }
    return errorCatcher;
}

export const registerProfiler = (router: Router) => {
    router.get("/entities", wrapCatcher(getEntitiesRoute));
    router.get("/entities/:ids", wrapCatcher(getEntitiesByIdRoute));

    // NOTE: creation
    router.post("/master/company", wrapCatcher(createMasterCo));
    router.post("/master/person", wrapCatcher(createMasterPerson));
    router.post("/client/company", wrapCatcher(createClientCo));
    router.post("/client/person", wrapCatcher(createClientPerson));
    router.post("/service-provider/company", wrapCatcher(createSPCo));
    router.post("/service-provider/person", wrapCatcher(createSPPerson));

    // NOTE: patch 
    router.patch("/master/company/:id", wrapCatcher(patchMasterCo));
    router.patch("/master/person/:id", wrapCatcher(patchMasterPerson));
    router.patch("/client/company/:id", wrapCatcher(patchClientCo));
    router.patch("/client/person/:id", wrapCatcher(patchClientPerson));
    router.patch("/service-provider/company/:id", wrapCatcher(patchSPCo));
    router.patch("/service-provider/person/:id", wrapCatcher(patchSPPerson));
    /*
    router.patch("/service-provider/person/:id", async (req, resp, next) => {
        try {
            await patchSPPerson(req, resp, next)
        } catch (error) {
            next(error);
        }
    });
    */

    // NOTE: 
    /*
    router.post("/master/company/:id/employee", createMasterCo);
    router.patch("/master/company/:id/employee/:id", patchMasterCo);

    router.post("/client/company/:id/employee", createClientCo);
    router.patch("/client/company/:id/employee/:id", patchClientCo);

    router.post("/service-provider/company/:id/employee", createSPCo);
    router.patch("/service-provider/company/:id/employee/:id", patchSPPerson);
    */
}

// SECTION: creation block
const createMasterCo: RequestHandler = async (req, resp, next) => {
    const data = req.body;

    const { instance } = new EntityModelManager(EntityType.MASTER_COMPANY);
    instance.validate(data);
    instance.fromDto(data, 0);

    const payload = await wrapTask(`create master company`, (client) => {
        return insertEntity(instance.getValues(), { client })
    })

    resp.json({ payload });
}

const createMasterPerson: RequestHandler = async (req, resp, next) => {
    const data = req.body;

    const { instance } = new EntityModelManager(EntityType.MASTER_PERSON);
    instance.validate(data);
    instance.fromDto(data, 0);

    const payload = await wrapTask(`create master person`, (client) => {
        return insertEntity(instance.getValues(), { client })
    })

    resp.json({ payload });
}

const createClientCo: RequestHandler = async (req, resp, next) => {
    const data = req.body;

    const { instance } = new EntityModelManager(EntityType.CLIENT_COMPANY);
    instance.validate(data);
    instance.fromDto(data, 0);

    const payload = await wrapTask(`create client company`, (client) => {
        return insertEntity(instance.getValues(), { client })
    })

    resp.json({ payload });
}

const createClientPerson: RequestHandler = async (req, resp, next) => {
    const data = req.body;

    const { instance } = new EntityModelManager(EntityType.CLIENT_PERSON);
    instance.validate(data);
    instance.fromDto(data, 0);

    const payload = await wrapTask(`create service provider person`, (client) => {
        return insertEntity(instance.getValues(), { client })
    })

    resp.json({ payload });
}

const createSPCo: RequestHandler = async (req, resp, next) => {
    const data = req.body;

    const { instance } = new EntityModelManager(EntityType.SERVICE_PROVIDER_COMPANY);
    instance.validate(data);
    instance.fromDto(data, 0);

    const payload = await wrapTask(`create service provider company`, (client) => {
        return insertEntity(instance.getValues(), { client })
    })

    resp.json({ payload });
}

const createSPPerson: RequestHandler = async (req, resp, next) => {
    const data = req.body;

    const { instance } = new EntityModelManager(EntityType.SERVICE_PROVIDER_PERSON);
    instance.validate(data);
    instance.fromDto(data, 0);

    const payload = await wrapTask(`create service provider person`, (client) => {
        return insertEntity(instance.getValues(), { client })
    })

    resp.json({ payload });
}

// SECTION: update block
const patchMasterCo: RequestHandler = async (req, resp, next) => {
    const { id } = req.params;
    const data = req.body;

    const { instance } = new EntityModelManager(EntityType.MASTER_COMPANY);
    instance.validate(data);
    instance.fromDto(req.body, Number(id));

    const payload = await wrapTask(`patch master company`, (client) => {
        return updateEntity(instance.getValues(), {
            client,
            criteria: { entityClass: EntityClass.MASTER, entityTypePrimary: PrimaryType.COMPANY }
        })
    })

    resp.json({ payload });
}

const patchMasterPerson: RequestHandler = async (req, resp, next) => {
    const { id } = req.params;
    const data = req.body;

    const { instance } = new EntityModelManager(EntityType.MASTER_PERSON);
    instance.validate(data);
    instance.fromDto(req.body, Number(id));

    const payload = await wrapTask(`patch master person`, (client) => {
        return updateEntity(instance.getValues(), {
            client,
            criteria: { entityClass: EntityClass.MASTER, entityTypePrimary: PrimaryType.PERSONAL }
        })
    })

    resp.json({ payload });
}

const patchClientCo: RequestHandler = async (req, resp, next) => {
    const { id } = req.params;
    const data = req.body;

    const { instance } = new EntityModelManager(EntityType.CLIENT_COMPANY);
    instance.validate(data);
    instance.fromDto(req.body, Number(id));

    const payload = await wrapTask(`patch client company`, (client) => {
        return updateEntity(instance.getValues(), {
            client,
            criteria: { entityClass: EntityClass.CLIENT, entityTypePrimary: PrimaryType.COMPANY }
        })
    })

    resp.json({ payload });
}

const patchClientPerson: RequestHandler = async (req, resp, next) => {
    const { id } = req.params;
    const data = req.body;

    const { instance } = new EntityModelManager(EntityType.CLIENT_PERSON);
    instance.validate(data);
    instance.fromDto(req.body, Number(id));

    const payload = await wrapTask(`patch service provider person`, (client) => {
        return updateEntity(instance.getValues(), {
            client,
            criteria: { entityClass: EntityClass.CLIENT, entityTypePrimary: PrimaryType.PERSONAL }
        })
    })

    resp.json({ payload });
}

const patchSPCo: RequestHandler = async (req, resp, next) => {
    const { id } = req.params;
    const data = req.body;

    const { instance } = new EntityModelManager(EntityType.SERVICE_PROVIDER_COMPANY);
    instance.validate(data);
    instance.fromDto(req.body, Number(id));


    const payload = await wrapTask(`patch service provider company`, (client) => {
        return updateEntity(instance.getValues(), {
            client,
            criteria: { entityClass: EntityClass.SERVICE_PROVIDER, entityTypePrimary: PrimaryType.COMPANY }
        })
    })

    resp.json({ payload });
}

const patchSPPerson: RequestHandler = async (req, resp, next) => {
    const { id } = req.params;
    const data = req.body;

    const { instance } = new EntityModelManager(EntityType.SERVICE_PROVIDER_PERSON);
    instance.validate(data);
    instance.fromDto(req.body, Number(id));

    const payload = await wrapTask(`patch service provider person`, (client) => {
        return updateEntity(instance.getValues(), {
            client,
            criteria: { entityClass: EntityClass.SERVICE_PROVIDER, entityTypePrimary: PrimaryType.PERSONAL }
        })
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
