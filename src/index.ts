import express, { Router, type ErrorRequestHandler, type RequestHandler } from "express";
import { registerRoutes } from "./routes";
import { z } from "zod";

const apiConfig = {
    PORT_NUMBER: 3000
}

const router = Router();
registerRoutes(router);

const test: RequestHandler = (req, res, next) => {
    res.json({ value: "someting here" })
    next()
}

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.log("err", err);
    res.status(500)
        .json()
        .end()
}

const server = express();
server.use(express.json());
server.use("/api", router);
server.use("/healthcheck", (req, resp, next)=>{
    const diagnostics = {
        commit: "test",
        environment: "development",
    }; 
    resp.json(diagnostics);
});
server.use(test);
// server.use(cors());
// server.use(writeHeaders);
// server.use(express.json());
// registerRoutes(server);
server.use(errorHandler);
// server.listen(apiConfig.PORT_NUMBER);

const x = z.string()//.datetime()
const result = x.safeParse(new Date().toISOString())
const result1 = x.safeParse(111)
console.log(result)
console.log(result1)

/*
const spCo = new ServiceProviderCompanyModel()
spCo.entity.entityId = 1
spCo.entity.entityName = "name12377788"

wrapTask("insert entity", async (client) => {
    const data = await registerEntity(spCo.getValues(), { client })
    console.log(data)
    return data
})
wrapTask("update entity", async (client) => {
    const data= await updateEntity(spCo.getValues(), { client })
    console.log(data)
    return data
})

wrapTask("select entity", async (client) => {
    const instance = new ServiceProviderCompanyRecord();
    const { keys: columns } = useInsertTemplate(instance.getValues());
    const data = await getEntitiesById([2], { client, columns })
    console.log(data)
    return data
})
    */