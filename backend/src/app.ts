import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import pollRouter from "./routers/pollRouter";

dotenv.config();
const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_ORIGIN,
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

app.use(express.json());
app.use("/api/polls", pollRouter);

export default app;
