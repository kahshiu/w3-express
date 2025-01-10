import { Pool, PoolConfig } from "pg";
import { DbCreds, ICreds } from "./DbConfigs";

export class PgProvider {
    pgPool: Pool | null = null;

    constructor(config: DbCreds<ICreds>) {
        const pgPool = new Pool(this.adaptCreds(config));

        // TODO: add logger
        pgPool.on("connect", (client) => {
            console.log("connect")
        });
        pgPool.on("release", (client) => {
            console.log("release")
        });
        pgPool.on("acquire", (client) => {
            console.log("acquire")
        });
        pgPool.on("remove", (client) => {
            console.log("remove")
        });
        pgPool.on("error", (err, client) => {
            console.log("error")
            // TODO: evaluate necessity
            // process.exit(-1)
        });

        this.pgPool = pgPool;
    }

    private adaptCreds(config: DbCreds<ICreds>) {
        return {
            host: config.DB_HOST,
            port: config.DB_PORT,
            database: config.DB_NAME,
            user: config.DB_USER,
            password: config.DB_PASSWORD,
        } as PoolConfig;
    }

    async getConnection() {
        if (this.pgPool == null) return;
        return this.pgPool.connect()
    }

    async destroy() {
        if (this.pgPool == null) return;
        this.pgPool.end();
        this.pgPool = null;
    }
}