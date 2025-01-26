import { RequestHandler, Router } from "express";
import { getTaskCustomColumns } from "./tasks.repository";
import { wrapTask } from "@src/db/PgHelpers";
import { wrapCatcher } from "@src/helpers/middlewares";

export const registerTasks = (router: Router) => {
    router.get("/task/custom-cols/:dataTypes", wrapCatcher(getTasks));
}

const getTasks: RequestHandler = async (req, resp, next) => {
    const payload = await wrapTask(`get custom columns`, (client) => {
        const { dataTypes } = req.params;
        return getTaskCustomColumns({
            client,
            criteria: { dataTypes: dataTypes.split(",") }
        })
    })
    resp.json({ payload })
}