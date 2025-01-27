import { RequestHandler, Router } from "express";
import { getTaskCustomColumns } from "./tasks.repository";
import { wrapTask } from "@src/db/PgHelpers";
import { wrapCatcher } from "@src/helpers/middlewares";
import { createTaskColumn, removeTaskColumn } from "./tasks.service";
import { HttpBadRequest, HttpClientUnprocessableContent } from "@src/errors/HttpError";
import { z } from "zod";
import { DataTypes } from "./domain/ColumnTypes";

export const registerTasks = (router: Router) => {
    router.get("/tasks/custom-columns", wrapCatcher(getTasks));
    router.get("/tasks/custom-columns/:dataTypes", wrapCatcher(getTasks));

    router.post("/tasks/custom-columns/:columnName/:dataType", wrapCatcher(addCustomColumn));
    router.delete("/tasks/custom-columns/:columnName", wrapCatcher(deleteCustomColumn));
}

const getTasks: RequestHandler = async (req, resp, next) => {
    const payload = await wrapTask(`get custom columns`, (client) => {
        const { dataTypes } = req.params;
        return getTaskCustomColumns({
            client,
            criteria: { dataTypes: dataTypes ? dataTypes.split(",") : [] }
        })
    })
    resp.json({ payload })
}

const addCustomColumn: RequestHandler = async (req, resp, next) => {
    const { columnName, dataType } = req.params;
    z.object({
        columnName: z.string(),
        dataType: z.enum(DataTypes),
    }).parse({
        columnName,
        dataType,
    });
    const payload = await wrapTask(`add custom columns`, (client) => {
        return createTaskColumn(
            columnName,
            dataType,
            { client }
        )
    })
    if (payload === false) throw new HttpClientUnprocessableContent("Column Exists")
    resp.json({ payload })
}

const deleteCustomColumn: RequestHandler = async (req, resp, next) => {
    const { columnName } = req.params;
    z.object({ columnName: z.string() }).parse({ columnName });

    const payload = await wrapTask(`remove custom columns`, (client) => {
        return removeTaskColumn(
            columnName,
            { client }
        )
    })
    if (payload === false) throw new HttpBadRequest("Column contains data")
    resp.json({ payload })
}