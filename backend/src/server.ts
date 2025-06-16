require("module-alias/register");

import { WebSocketServer } from "ws";
import app from "./app";
import VoteService from "./services/VoteService";
import WS_EVENTS from "@shared/constants/WS_EVENTS";

const PORT = 5000;

const server = app.listen(PORT, () => {
    console.log(`The server started listening on port: ${PORT}`);
});

const websocketServer = new WebSocketServer({ noServer: true });
const PollsVoteService = new VoteService(websocketServer);

server.on("upgrade", (req, socket, head) => {
    websocketServer.handleUpgrade(req, socket, head, (ws) => {
        websocketServer.emit("connection", ws, req);
    });
});

websocketServer.on("connection", async (ws, req) => {
    ws.on("error", (e: Error) => console.log("WS ERROR: ", e.message));

    console.log("WS connected");
    await PollsVoteService.start();

    ws.on("message", async (message) => {
        try {
            const parsed = JSON.parse(message.toString());

            if (parsed.event === WS_EVENTS.VOTE_POLL) {
                const { optionId } = parsed.data;

                await PollsVoteService.handleVoteMessage(optionId);
            }
        } catch {
            console.log("Error while proccessing message: ");
        }
    });

    ws.on("close", () => {
        console.log("WS connection is closed.");
    });
});
