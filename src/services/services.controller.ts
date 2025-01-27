import { wrapTask, wrapTrx } from "@src/db/PgHelpers";
import { wrapCatcher } from "@src/helpers/middlewares";
import { parseNumber } from "@src/helpers/util";
import { RequestHandler, Router } from "express";
import { createServiceClient, modifyServiceClient } from "./serviceClient.service";
import { modifyEntireServiceType } from "./serviceTypes.service";

export const registerServices = (router: Router) => {
    router.post("/service-types/:id", wrapCatcher(postServiceTypes));
    router.post("/service-types/:serviceTypeId/clients", wrapCatcher(postServiceClients));
    router.patch("/service-types/:serviceTypeId/clients", wrapCatcher(patchServiceClients));
}

export const postServiceClients: RequestHandler = async (req, resp, next) => {
    const serviceTypeId = parseNumber(req.params.serviceTypeId);
    const entityId = parseNumber(req.params.entityId);
    const dto = req.body;

    const payload = await wrapTask("insert service clients", async (client) => {
        return createServiceClient(dto, { client, entityId, serviceTypeId })
    })

    resp.json({ payload });
}

export const patchServiceClients: RequestHandler = async (req, resp, next) => {
    const serviceTypeId = parseNumber(req.params.serviceTypeId);
    const entityId = parseNumber(req.params.entityId);
    const dto = req.body;

    const payload = await wrapTask("update service clients", async (client) => {
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
        return modifyEntireServiceType(dto, { client });
    })

    resp.json({ payload });
}