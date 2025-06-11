import express from "express";
import pollRouter from "./routers/pollRouter";

const app = express();

app.use(express.json());
app.use("/api/polls", pollRouter);

export default app;
