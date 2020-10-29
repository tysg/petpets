import fs from "fs";
import pg from "pg";

console.log("Setting up database...");
const schema = fs.readFileSync("sql/schema.sql").toString();
const seed = fs.readFileSync("sql/seeds.sql").toString();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
});


pool.query(schema+seed, (err, res) => {
    if (err) {
        console.log("Setup database failed: ", err);
    }
    console.log("Setup database succeeded.");    
});


pool.end(() => {
    console.log('pool has ended');
});


// https://stackoverflow.com/questions/22636388/import-sql-file-in-node-js-and-execute-against-postgresql