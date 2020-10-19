import fs from "fs";
import pg from "pg";

console.log("Setting up database...");
const schema = fs.readFileSync("sql/schema.sql").toString();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
});


pool.query(schema, (err, res) => {
    if (err) {
        console.log("Setup database failed: ", err);
        process.exit(1);
    }
    console.log("Setup database succeeded.");
    process.exit(0);
});

// https://stackoverflow.com/questions/22636388/import-sql-file-in-node-js-and-execute-against-postgresql