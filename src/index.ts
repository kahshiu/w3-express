import express, { Router } from "express";
import { registerRoutes } from "./routes";
import { errorHandler, healthCheckHandler } from "./helpers/middlewares";

const apiConfig = {
    PORT_NUMBER: 3000
}

const router = Router();
registerRoutes(router);

const server = express();
// server.use(cors());
// server.use(writeHeaders);
server.use(express.json());
server.use("/healthcheck", healthCheckHandler);
server.use("/api", router);
server.use(errorHandler);
server.listen(apiConfig.PORT_NUMBER);