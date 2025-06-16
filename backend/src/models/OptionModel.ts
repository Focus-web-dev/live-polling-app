import PollOption from "@shared/interfaces/PollOption";

import { sqliteKnex } from "../config/sqliteKnex";
import { DB_TABLE_NAMES } from "../enums/DB_TABLE_NAMES";

class OptionModel {
    public async queryById(id: string) {
        const option: PollOption = await sqliteKnex(DB_TABLE_NAMES.options)
            .where({ pollId: id })
            .first();
        return option;
    }

    public async incrementVote(id: string) {
        await sqliteKnex(DB_TABLE_NAMES.options)
            .where({ pollId: id })
            .first()
            .increment("votes", 1);

        return id;
    }
}

export default new OptionModel();
