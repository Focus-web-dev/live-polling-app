import type { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
    development: {
        client: "sqlite3",
        connection: {
            filename: `${process.cwd()}/data/database.sqlite`,
        },
        migrations: {
            directory: `${process.cwd()}/migrations`,
            extension: "ts",
        },
        useNullAsDefault: true,
    },
};

module.exports = config;
