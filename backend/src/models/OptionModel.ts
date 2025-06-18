import PollOption from "@shared/interfaces/PollOption";

import { sqliteKnex } from "../config/sqliteKnex";
import { DB_TABLE_NAMES } from "../enums/DB_TABLE_NAMES";

class OptionModel {
    public async queryById(optionId: string): Promise<PollOption> {
        return await sqliteKnex(DB_TABLE_NAMES.options).where({ id: optionId }).first();
    }

    public async queryByPollId(id: string): Promise<PollOption[]> {
        return await sqliteKnex(DB_TABLE_NAMES.options).where({ poll_id: id });
    }

    public async incrementVote(optionId: string): Promise<PollOption> {
        await sqliteKnex(DB_TABLE_NAMES.options).where({ id: optionId }).increment("votes", 1);
        return await this.queryById(optionId);
    }
}

export default new OptionModel();
