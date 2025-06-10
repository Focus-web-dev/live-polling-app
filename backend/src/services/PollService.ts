import { v4 as uuid } from "uuid";
import PollModel from "../models/PollModel";

class PollService {
    public async create(title: string, options: string[]) {
        const id = uuid();

        const optionInserts = options.map((option) => ({
            id: uuid(),
            poll_id: id,
            text: option,
            votes: 0,
        }));

        return await PollModel.insert({ id, title, options: optionInserts });
    }

    public async getAll() {
        return await PollModel.selectAllPolls();
    }

    public async getById(id: string) {
        return await PollModel.queryById(id);
    }
}

export default new PollService();
