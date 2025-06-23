import { Knex } from "knex";
import { sqliteKnex } from "../config/sqliteKnex";

export class BaseModel<T, InsertType = Partial<T>, UpdateType = Partial<T>> {
    protected tableName: string;
    protected db: Knex;

    constructor(tableName: string) {
        this.tableName = tableName;
        this.db = sqliteKnex;
    }

    public async findAll(
        queryBuilder?: (qb: Knex.QueryBuilder) => Knex.QueryBuilder
    ): Promise<T[]> {
        let qb = this.db(this.tableName).select("*");
        if (queryBuilder) qb = queryBuilder(qb);
        return qb;
    }

    public async findById(id: string): Promise<T | undefined> {
        return this.db(this.tableName).where({ id }).first();
    }

    public async insert(data: InsertType): Promise<T> {
        try {
            const [inserted] = await this.db(this.tableName).insert(data).returning("*");
            if (!inserted) throw new Error("Insert failed");
            return inserted;
        } catch {
            const found = await this.findById((data as any).id);
            if (!found) throw new Error("Insert failed");
            return found;
        }
    }

    public async update(id: string, data: UpdateType): Promise<T> {
        try {
            const [updated] = await this.db(this.tableName)
                .where({ id })
                .update(data)
                .returning("*");
            if (!updated) throw new Error("Update failed");
            return updated;
        } catch {
            const found = await this.findById(id);
            if (!found) throw new Error("Update failed");
            return found;
        }
    }
}
