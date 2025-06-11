import { Request, Response } from "express";
import PollService from "../services/PollService";
import ErrorHandler from "../helpers/ErrorHandler";

class PollController {
    public async post(req: Request, res: Response) {
        try {
            const { title, options } = req.body;
            const polls = await PollService.create(title, options);

            res.status(200).json(polls);
        } catch (error) {
            const { status, message } = ErrorHandler.handleError(error);
            res.status(status).send(message);
        }
    }

    public async getAll(req: Request, res: Response) {
        try {
            const polls = await PollService.getAll();
            res.status(200).json(polls);
        } catch (error) {
            const { status, message } = ErrorHandler.handleError(error);
            res.status(status).send(message);
        }
    }

    public async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const polls = await PollService.getById(id);

            res.status(200).json(polls);
        } catch (error) {
            const { status, message } = ErrorHandler.handleError(error);
            res.status(status).send(message);
        }
    }
}

export default new PollController();
