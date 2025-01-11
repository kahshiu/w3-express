import { HttpError } from "@src/errors/HttpError";
import { RequestHandler, ErrorRequestHandler } from "express";

export const wrapCatcher = (fn: RequestHandler) => {
    const errorCatcher: RequestHandler = async (req, resp, next) => {
        try {
            await fn(req, resp, next);
        } catch (error) {
            next(error)
        }
    }
    return errorCatcher;
}

export const errorHandler: ErrorRequestHandler = (err, req, resp, next) => {
    const error = err as HttpError
    const { details } = error;
    resp.statusCode = details.statusCode;
    resp.statusMessage = details.statusMessage;
    resp.json({ message: err.message });
}

export const healthCheckHandler: RequestHandler = (req, resp, next) => {
    const diagnostics = {
        commit: "test",
        environment: "development",
    };
    resp.json(diagnostics);
}
