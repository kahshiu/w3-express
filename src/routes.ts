import { registerProfiler } from "@src/profiler/profiler.controller";
import { Router } from "express";
import { registerServices } from "./services/services.controller";
import { registerTasks } from "./tasks/tasks.controller";

export const registerRoutes = (router: Router) => {
    registerProfiler(router);
    registerServices(router);
    registerTasks(router);
}