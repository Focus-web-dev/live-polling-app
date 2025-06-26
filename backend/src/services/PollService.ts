import { v4 as uuid } from "uuid";

import PollModel from "../models/PollModel";
import OptionModel from "../models/OptionModel";

import PollOption from "@shared/interfaces/PollOption";
import PollData from "@shared/interfaces/PollData";

import { getPollVoteManager } from "../managers/PollVoteManager";
import { WS_EVENTS } from "@shared/enums/WS_EVENTS";

class PollService {
    public async create(title: string, options: string[]): Promise<PollData> {
        const id = uuid();

        const poll = await PollModel.insert({
            id,
            title,
        });

        const optionInserts: PollOption[] = options.map((option) => ({
            id: uuid(),
            poll_id: id,
            text: option,
            votes: 0,
        }));

        await Promise.all(optionInserts.map((opt) => OptionModel.insert(opt)));

        const pollVoteManager = getPollVoteManager();

        if (pollVoteManager) {
            pollVoteManager.emitEvent(WS_EVENTS.QUEUE_POLL, { poll });
        }

        return poll;
    }

    public async getAll(): Promise<PollData[]> {
        return await PollModel.findAll();
    }

    public async getById(id: string): Promise<PollData> {
        const poll = await PollModel.findById(id);

        if (!poll) {
            throw new Error("Poll not found");
        }

        return poll;
    }

    public async getNonExpired(): Promise<PollData[]> {
        return await PollModel.findAll((qb) => qb.where({ is_expired: false }));
    }

    public async update(id: string, data: Partial<PollData>): Promise<PollData> {
        return await PollModel.update(id, data);
    }
}

export default new PollService();
