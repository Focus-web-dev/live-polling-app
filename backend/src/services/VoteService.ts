import { WebSocketServer } from "ws";
import type WebSocket from "ws";

import WebsocketMessage from "@shared/interfaces/WebsocketMessage";
import { WS_EVENTS } from "@shared/enums/WS_EVENTS";

import PollModel from "../models/PollModel";
import PollData from "@shared/interfaces/PollData";

export default class VoteService {
    private currentPoll: PollData | null = null;
    private currentPollTimeout: NodeJS.Timeout | null = null;
    private isActive = false;
    private connections: Record<string, WebSocket> = {};

    private websocketServer: WebSocketServer;

    constructor(websocketServer: WebSocketServer) {
        this.websocketServer = websocketServer;

        this.websocketServer.on("connection", async (ws, request) => {
            const clientIP = request.socket.remoteAddress;
            console.log("CONNECTION: ", clientIP);

            if (!clientIP) {
                console.log("Client ID is undefined, close connection...");
                ws.close();

                return;
            }

            this.connections[clientIP] = ws;

            if (this.currentPoll && this.isActive) {
                const actualMessage = JSON.stringify({
                    event: WS_EVENTS.SWITCH_POLL,
                    data: this.currentPoll,
                });

                ws.send(actualMessage);
            }

            ws.on("message", (message) => this.handleMessage(message));
            ws.on("close", () => this.handleClose(clientIP));
        });
    }

    public async startVote() {
        const nonExpiredPoll = await PollModel.queryNonExpiredPoll();

        if (!nonExpiredPoll) {
            this.clearCurrentPoll();
            this.isActive = false;
            this.broadcastMessage({ event: WS_EVENTS.POLL_QUEUE_END });
            return;
        }

        this.currentPoll = nonExpiredPoll;
        this.isActive = true;

        this.broadcastMessage({ event: WS_EVENTS.SWITCH_POLL, data: nonExpiredPoll });

        const expiresInMs = Number(nonExpiredPoll.expires_in) * 1000;

        console.log("DELAY: ", expiresInMs);

        if (this.currentPollTimeout) {
            clearTimeout(this.currentPollTimeout);
        }

        this.currentPollTimeout = setTimeout(async () => {
            console.log("TIMED OUT");
            await PollModel.updatePoll(nonExpiredPoll.id, { is_expired: true });
            this.clearCurrentPoll();
            await this.startVote();
        }, expiresInMs);
    }

    private clearCurrentPoll() {
        this.currentPoll = null;

        if (this.currentPollTimeout) {
            clearTimeout(this.currentPollTimeout);
            this.currentPollTimeout = null;
        }
    }

    private handleClose(ip: string) {
        delete this.connections[ip];
        console.log("Connection ", ip, " removed!");
    }

    private async handleMessage(bytes: WebSocket.RawData) {
        const parsed: WebsocketMessage = JSON.parse(bytes.toString());

        switch (parsed.event) {
            case WS_EVENTS.VOTE_POLL:
                console.log("VOTE POLL OPTION: ", parsed.data);
                return;
            case WS_EVENTS.QUEUE_POLL:
                await this.startVote();
        }
    }

    private broadcastMessage(message: WebsocketMessage) {
        Object.keys(this.connections).forEach((connection) => {
            const connectionWebsocket = this.connections[connection];
            connectionWebsocket.send(JSON.stringify(message));
        });
    }
}
