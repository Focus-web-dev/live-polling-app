import express, { Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

app.use(express.json());

app.get("/api/test", (req: Request, res: Response) => {
    console.log("Received GET request to /api/test");
    res.json({ message: "Backend is up and running! This is a test endpoint." });
});

io.on("connection", (socket: Socket) => {
    console.log(`A client connected with ID: ${socket.id}`);

    socket.on("ping", (data: any) => {
        console.log(`Received ping from ${socket.id}:`, data);
        socket.emit("pong", { message: "pong!", timestamp: new Date().toISOString() });
    });

    socket.on("disconnect", () => {
        console.log(`Client disconnected with ID: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Backend server listening on port ${PORT}`);
    console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
});
