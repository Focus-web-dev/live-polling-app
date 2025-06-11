import knex from "knex";
import path from "path";

const databaseFileName = path.join(process.cwd(), "./data/database.sqlite");

export const sqliteKnex = knex({
    client: "sqlite3",
    connection: { filename: databaseFileName },
    useNullAsDefault: true,
});
