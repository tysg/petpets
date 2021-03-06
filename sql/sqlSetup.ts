import fs from "fs";
import pg from "pg";

console.log("Setting up database...");
const schema = fs.readFileSync("sql/schema.sql").toString();
const triggers = fs.readFileSync("sql/triggers.sql").toString();
const seed = fs.readFileSync("sql/seeds.sql").toString();
const genSeed = fs.readFileSync("sql/generatedSeed.sql").toString();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
});

// console.log(seedString);

pool.query(schema + triggers + genSeed + seed, (err, res) => {
    if (err) {
        console.log("Setup database failed: ", err);
        pool.end(() => {
            console.log("pool has ended");
            process.exit(1);
        });
    } else {
        console.log("Setup database succeeded.");
        pool.end(() => {
            console.log("pool has ended");
            process.exit(0);
        });
    }
});

// https://stackoverflow.com/questions/22636388/import-sql-file-in-node-js-and-execute-against-postgresql
