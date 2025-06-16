import { sqliteKnex } from "../config/sqliteKnex";
import { DB_TABLE_NAMES } from "../enums/DB_TABLE_NAMES";

import PollData from "@shared/interfaces/PollData";
import PollOption from "@shared/interfaces/PollOption";

type PollDataInsert = Pick<PollData, "id" | "title" | "options">;

class PollModel {
    public async insert(poll: PollDataInsert): Promise<PollDataInsert> {
        return await sqliteKnex.transaction(async (transaction) => {
            await transaction("polls").insert({ id: poll.id, title: poll.title });
            await transaction("options").insert(poll.options);

            const insertedPoll = await transaction("polls").where({ id: poll.id }).first();
            const options = await transaction("options").where({ poll_id: poll.id });

            return { ...insertedPoll, options };
        });
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

    public async queryNonExpiredPoll(): Promise<PollData | null> {
        const now = new Date().toISOString();
        const rawCondition = `datetime(created_at, '+' || expires_in || ' seconds') > datetime(?)`;

        const poll: PollData = await sqliteKnex(DB_TABLE_NAMES.polls)
            .whereRaw(rawCondition, [now])
            .orderBy("createdAt", "asc")
            .first();

        if (!poll) {
            return null;
        }

        const options = await sqliteKnex(DB_TABLE_NAMES.options).where({ pollId: poll.id });
        return { ...poll, options };
    }

    public async queryById(id: string) {
        const poll = await sqliteKnex(DB_TABLE_NAMES.polls).where({ id }).first();
        const options = await sqliteKnex(DB_TABLE_NAMES.options).where({ poll_id: id });

        return { ...poll, options };
    }
}

export default new PollModel();
