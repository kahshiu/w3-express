import { registerProfiler } from "@src/profiler/profiler.controller";
import { Router } from "express";

export const registerRoutes = (router: Router) => {
    registerProfiler(router);
}