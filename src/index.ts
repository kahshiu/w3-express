import express, { Router, type ErrorRequestHandler, type RequestHandler } from "express";
import { registerRoutes } from "./routes";
import { HttpError } from "./errors/HttpError";

const apiConfig = {
    PORT_NUMBER: 3000
}

const router = Router();
registerRoutes(router);

const healthCheckHandler: RequestHandler = (req, resp, next) => {
    const diagnostics = {
        commit: "test",
        environment: "development",
    };
    resp.json(diagnostics);
}

const errorHandler: ErrorRequestHandler = (err, req, resp, next) => {
    const error = err as HttpError
    const { details } = error;
    resp.statusCode = details.statusCode;
    resp.statusMessage = details.statusMessage;
    resp.json({ message: err.message });
}

const server = express();
// server.use(cors());
// server.use(writeHeaders);
server.use(express.json());
server.use("/healthcheck", healthCheckHandler);
server.use("/api", router);
server.use(errorHandler);
server.listen(apiConfig.PORT_NUMBER);