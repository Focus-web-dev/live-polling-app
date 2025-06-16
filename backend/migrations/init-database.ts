import type { Knex } from "knex";
import { DB_TABLE_NAMES } from "../src/enums/DB_TABLE_NAMES";

export async function up(knex: Knex): Promise<void> {
    return knex.schema
        .createTable(DB_TABLE_NAMES.polls, (table) => {
            table.string("id").primary();
            table.string("title").notNullable();
            table.integer("expires_in").notNullable().defaultTo(60);
            table.timestamp("created_at").defaultTo(knex.fn.now());
        })
        .createTable(DB_TABLE_NAMES.options, (table) => {
            table.string("id").primary();
            table
                .string("poll_id")
                .notNullable()
                .references("id")
                .inTable("polls")
                .onDelete("CASCADE");
            table.string("text").notNullable();
            table.integer("votes").defaultTo(0);
        });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .dropTableIfExists(DB_TABLE_NAMES.options)
        .dropTableIfExists(DB_TABLE_NAMES.polls);
}
