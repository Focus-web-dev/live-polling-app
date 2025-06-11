import express from "express";
import pollController from "../controllers/PollController";

const pollRouter = express.Router();

pollRouter.post("/", pollController.post);
pollRouter.get("/", pollController.getAll);

pollRouter.get("/:id", pollController.getById);

export default pollRouter;
