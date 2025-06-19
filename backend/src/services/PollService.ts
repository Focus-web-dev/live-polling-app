import { v4 as uuid } from "uuid";

import PollModel from "../models/PollModel";
import OptionModel from "../models/OptionModel";

import PollOption from "@shared/interfaces/PollOption";
import PollData from "@shared/interfaces/PollData";

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
        return { ...poll, options: optionInserts };
    }

    public async getAll(): Promise<PollData[]> {
        const polls = await PollModel.findAll();
        const options = await OptionModel.findAll();

        const optionMap: Map<string, PollOption[]> = new Map();

        options.forEach((option) => {
            const isAlreadyExist = optionMap.has(option.poll_id);

            if (!isAlreadyExist) {
                optionMap.set(option.poll_id, []);
            }

            optionMap.get(option.poll_id)!.push(option);
        });

        return polls.map((poll) => ({ ...poll, options: optionMap.get(poll.id) || [] }));
    }

    public async getById(id: string): Promise<PollData> {
        const poll = await PollModel.findById(id);

        if (!poll) {
            throw new Error("Poll not found");
        }

        const options = await OptionModel.findAll((qb) => qb.where({ poll_id: id }));
        return { ...poll, options };
    }

    public async getNonExpired(): Promise<PollData[]> {
        return await PollModel.findAll((qb) => qb.where({ is_expired: false }));
    }

    public async update(id: string, data: Partial<PollData>): Promise<PollData> {
        return await PollModel.update(id, data);
    }
}

export default new PollService();
