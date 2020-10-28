import { Pool } from "pg";
import { log } from "./logging";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Returns a Promise and lets the call site decide what to do
export function asyncQuery(text: string, params?: (string | number | undefined | Date)[]) {
    const start = Date.now();
    return pool
        .query(text, params)
        .then(data => {
            const duration = Date.now() - start;
            log.db_query('Executed query', { text, params, duration, rows: data.rowCount });
            return data;
        })
        .catch(err => {
            const duration = Date.now() - start;
            log.error('Error while executing async query', { text, params, duration, err });
            throw err;
        });
}
