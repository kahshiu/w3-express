import { wrapTrx } from "@src/db/PgHelpers";
import { wrapCatcher } from "@src/helpers/middlewares";
import { RequestHandler, Router } from "express";
import { modifyServiceType } from "./serviceTypes.service";
import { serviceTypeFromDto } from "./domain/ServiceType";

export const registerServices = (router: Router) => {
    router.post("/service-types/:id", wrapCatcher(postServiceTypes));
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