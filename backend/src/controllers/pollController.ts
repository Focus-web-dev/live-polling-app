import { Request, Response } from "express";
import PollService from "../services/PollService";

class PollController {
    public async post(req: Request, res: Response) {
        const { title, options } = req.body;
        const polls = await PollService.create(title, options);

        res.status(200).json(polls);
    }

    public async getAll(req: Request, res: Response) {
        const polls = await PollService.getAll();
        res.status(200).json(polls);
    }

    public async getById(req: Request, res: Response) {
        const { id } = req.params;
        const polls = await PollService.getById(id);

        res.status(200).json(polls);
    }
}

export default new PollController();
