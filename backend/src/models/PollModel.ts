import { sqliteKnex } from "../config/sqliteKnex";
import { DB_TABLE_NAMES } from "../enums/DB_TABLE_NAMES";

import PollData from "@shared/interfaces/PollData";
import PollOption from "@shared/interfaces/PollOption";

class PollModel {
    public async insert(poll: PollData): Promise<PollData> {
        await sqliteKnex("polls").insert({ id: poll.id, title: poll.title });
        await sqliteKnex("options").insert(poll.options);

        return poll;
    }

    public async selectAllPolls(): Promise<PollData[]> {
        const polls: PollData[] = await sqliteKnex(DB_TABLE_NAMES.polls).select("*");
        const options: PollOption[] = await sqliteKnex(DB_TABLE_NAMES.options).select("*");

        const optionMap: Map<string, PollOption[]> = new Map();

        options.forEach((option) => {
            const isAlreadyExists = optionMap.has(option.poll_id);

            if (!isAlreadyExists) {
                optionMap.set(option.poll_id, []);
            }

            const optionsArray = optionMap.get(option.poll_id);

            if (optionsArray) {
                optionsArray.push(option);
            }
        });

        const pollsWithOptions = polls.map((poll) => ({
            ...poll,
            options: optionMap.get(poll.id) || [],
        }));

        return pollsWithOptions;
    }

    public async queryById(id: string) {
        const poll = await sqliteKnex(DB_TABLE_NAMES.polls).where({ id }).first();
        const options = await sqliteKnex(DB_TABLE_NAMES.options).where({ poll_id: id });

        return { ...poll, options };
    }
}

export default new PollModel();
