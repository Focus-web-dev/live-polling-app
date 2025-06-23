require("module-alias/register");
import { WebSocketServer } from "ws";

import app from "./app";
import { initPollVoteManager } from "./managers/PollVoteManager";

const PORT = 5000;

const server = app.listen(PORT, () => {
    console.log(`The server started listening on port: ${PORT}`);
});

const websocketServer = new WebSocketServer({ server });
initPollVoteManager(websocketServer);
