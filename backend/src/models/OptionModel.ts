import { BaseModel } from "./BaseModel";
import PollOption from "@shared/interfaces/PollOption";
import { DB_TABLE_NAMES } from "../enums/DB_TABLE_NAMES";

class OptionModel extends BaseModel<PollOption> {
    constructor() {
        super(DB_TABLE_NAMES.OPTIONS);
    }

    public async incrementVote(optionId: string): Promise<PollOption> {
        const [updated] = await this.db(this.tableName)
            .where({ id: optionId })
            .update({ votes: this.db.raw("votes + 1") })
            .returning("*");

        if (!updated) {
            throw new Error("Option not found");
        }

        return updated;
    }
}

export default new OptionModel();
