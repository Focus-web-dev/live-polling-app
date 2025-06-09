exports.up = function (knex) {
    return knex.schema
        .createTable("polls", (table) => {
            table.string("id").primary();
            table.string("title").notNullable();
        })
        .createTable("options", (table) => {
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
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("options").dropTableIfExists("polls");
};
