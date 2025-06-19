import knex, { Knex } from "knex";
import path from "path";

const databaseFilePath: string = path.join(process.cwd(), "./data/database.sqlite");

export const sqliteKnex: Knex = knex({
    client: "sqlite3",
    connection: { filename: databaseFilePath },
    useNullAsDefault: true,
});
