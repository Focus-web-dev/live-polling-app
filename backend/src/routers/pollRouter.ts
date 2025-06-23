import express from "express";
import PollController from "../controllers/PollController";

const pollRouter = express.Router();

pollRouter.post("/", PollController.create);
pollRouter.get("/", PollController.getAll);

pollRouter.get("/:id", PollController.getById);

export default pollRouter;
