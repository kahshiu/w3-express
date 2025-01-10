import { PoolClient } from "pg";
import { DbCreds } from "./DbConfigs";
import { PgProvider } from "./PgProvider";

// SECTION: interfaces
interface TFnQuery<TOutput> {
    (client: PoolClient): TOutput
}

// TODO: add env here
const pgCreds = new DbCreds();
const pgProvider = new PgProvider(pgCreds)

// TODO: add logger
export const wrapTask = async <TResult extends {}, TFn extends TFnQuery<TResult>>(opName: string, fn: TFn): Promise<TResult | null> => {
    const client = await pgProvider.getConnection() as PoolClient;
    let result: TResult | null = null;

    try {
        result = await fn(client);
    } catch (err) {
        console.log(opName, err)
    } finally {
        client.release();
    }

    return result;
};

export const wrapTrx = async <TResult extends {}, TFn extends TFnQuery<TResult>>(opName: string, fn: TFn): Promise<TResult | null> => {
    const client = await pgProvider.getConnection() as PoolClient;
    let result: TResult | null = null;

    try {
        await client.query("BEGIN");
        result = await fn(client);

        await client.query("COMMIT");
    } catch (err) {
        console.log(opName, err)
    } finally {
        client.release();
    }

    return result;
};