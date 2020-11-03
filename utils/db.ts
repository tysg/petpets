import { Pool } from "pg";
import { log } from "./logging";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Returns a Promise and lets the call site decide what to do
export function asyncQuery(
    text: string,
    params?: (string | number | undefined | Date | boolean)[]
) {
    const start = Date.now();
    return pool
        .query(text, params)
        .then((data) => {
            const duration = Date.now() - start;
            log.db_query("Executed query", {
                text,
                params,
                duration,
                rows: data.rowCount
            });
            return data;
        })
        .catch((err) => {
            const duration = Date.now() - start;
            log.error("Error while executing async query", {
                text,
                params,
                duration,
                err
            });
            throw err;
        });
}

export async function asyncTransaction(
    queries: string[],
    params: (string | number | undefined | Date)[][]
) {
    const start = Date.now();
    await pool.query("BEGIN");
    for (const i in queries) {
        const qr = queries[i];
        const currParam = params[i];
        try {
            const data = await pool.query(qr, currParam);
            const duration = Date.now() - start;
            log.db_query("Executed query", {
                qr,
                currParam,
                duration,
                rows: data.rowCount
            });
        } catch (err) {
            const duration = Date.now() - start;
            log.error("Error while executing transaction query", {
                qr,
                currParam,
                duration,
                err
            });
            throw err;
        }
    }
    const commitStatus = await pool.query("COMMIT");
    return commitStatus;
}
