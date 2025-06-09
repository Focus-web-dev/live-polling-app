import knex from "knex";

import fs from "fs";
import path from "path";

const databaseFileName = fs.readFileSync(path.join(__dirname, "../../database.sqlite"), "utf8");

export const sqliteKnex = knex({
    client: "sqlite3",
    connection: { filename: databaseFileName },
    useNullAsDefault: true,
});
