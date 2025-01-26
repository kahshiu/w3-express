import { wrapTask, wrapTrx } from "@src/db/PgHelpers";
import { wrapCatcher } from "@src/helpers/middlewares";
import { RequestHandler, Router } from "express";
import { modifyServiceType } from "./serviceTypes.service";
import { serviceTypeFromDto } from "./domain/ServiceType";
import { createServiceClient, modifyServiceClient } from "./serviceClient.service";

export const registerServices = (router: Router) => {
    router.post("/service-types/:id", wrapCatcher(postServiceTypes));
    router.post("/service-types/:serviceTypeId/clients", wrapCatcher(postServiceClients));
    router.patch("/service-types/:serviceTypeId/clients", wrapCatcher(patchServiceClients));
}

const parseNumber = (target: any) => {
    return target ? Number(target) : target;
}

export const postServiceClients: RequestHandler = async (req, resp, next) => {
    const serviceTypeId = parseNumber(req.params.serviceTypeId);
    const entityId = parseNumber(req.params.entityId);
    const dto = req.body;

    const payload = await wrapTask("insert service types", async (client) => {
        return createServiceClient(dto, { client, entityId, serviceTypeId })
    })

    resp.json({ payload });
}

export const patchServiceClients: RequestHandler = async (req, resp, next) => {
    const serviceTypeId = parseNumber(req.params.serviceTypeId);
    const entityId = parseNumber(req.params.entityId);
    const dto = req.body;

    const payload = await wrapTask("insert service types", async (client) => {
        return modifyServiceClient(dto, { client, entityId, serviceTypeId })
    })

    resp.json({ payload });

}

const postServiceTypes: RequestHandler = async (req, resp, next) => {
    const { id } = req.params;
    const dto = {
        serviceTypeId: Number(id),
        ...req.body
    }

    const payload = await wrapTrx("insert service types", async (client) => {
        const model = serviceTypeFromDto(dto);
        return modifyServiceType(model, { client });
    })

    resp.json({ payload });

}