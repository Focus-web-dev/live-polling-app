import { Request, Response } from "express";
import PollService from "../services/PollService";
import ErrorHandler from "../helpers/ErrorHandler";

class PollController {
    public async create(req: Request, res: Response): Promise<void> {
        try {
            const { title, options } = req.body;
            const createdPoll = await PollService.create(title, options);
            res.status(201).json(createdPoll);
            return;
        } catch (error) {
            const { status, message } = ErrorHandler.handleError(error);
            res.status(status).send(message);
            return;
        }
    }

    public async getAll(req: Request, res: Response): Promise<void> {
        try {
            const polls = await PollService.getAll();
            res.status(200).json(polls);
            return;
        } catch (error) {
            const { status, message } = ErrorHandler.handleError(error);
            res.status(status).send(message);
            return;
        }
    }

    public async getById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const poll = await PollService.getById(id);
            res.status(200).json(poll);
            return;
        } catch (error) {
            const { status, message } = ErrorHandler.handleError(error);
            res.status(status).send(message);
            return;
        }
    }
}

export default new PollController();
