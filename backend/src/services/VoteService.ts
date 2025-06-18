import { WebSocketServer } from "ws";
import type WebSocket from "ws";

import WebsocketMessage from "@shared/interfaces/WebsocketMessage";
import { WS_EVENTS } from "@shared/enums/WS_EVENTS";

import PollModel from "../models/PollModel";
import PollData from "@shared/interfaces/PollData";
import OptionModel from "../models/OptionModel";
import PollOption from "@shared/interfaces/PollOption";

export default class VoteService {
    private currentPoll: Exclude<PollData, "options"> | null = null;
    private currentPollOptions: PollOption[] | null = null;
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
                console.log("Client IP is undefined, close connection...");
                ws.close();

                return;
            }

            this.connections[clientIP] = ws;

            if (this.currentPoll && this.isActive) {
                await this.updateCurrentPollOptions();

                const data = {
                    poll: this.currentPoll,
                    options: this.currentPollOptions,
                };

                const actualMessage = JSON.stringify({
                    event: WS_EVENTS.SWITCH_POLL,
                    data,
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
            this.clearState();
            this.isActive = false;
            this.broadcastMessage({ event: WS_EVENTS.POLL_QUEUE_END });
            return;
        }

        this.currentPoll = nonExpiredPoll;
        await this.updateCurrentPollOptions();
        this.isActive = true;

        const data = {
            poll: this.currentPoll,
            options: this.currentPollOptions,
        };

        this.broadcastMessage({ event: WS_EVENTS.SWITCH_POLL, data });

        const expiresInMs = Number(nonExpiredPoll.expires_in) * 1000;

        if (this.currentPollTimeout) {
            clearTimeout(this.currentPollTimeout);
        }

        this.currentPollTimeout = setTimeout(async () => {
            await PollModel.updatePoll(nonExpiredPoll.id, { is_expired: true });
            this.clearState();
            await this.startVote();
        }, expiresInMs);
    }

    private async updateCurrentPollOptions() {
        if (!this.currentPoll) {
            this.currentPollOptions = null;
            return;
        }

        const pollOptions = await OptionModel.queryByPollId(this.currentPoll.id);
        this.currentPollOptions = pollOptions;
        return pollOptions;
    }

    private clearState() {
        this.currentPoll = null;
        this.currentPollOptions = null;

        if (this.currentPollTimeout) {
            clearTimeout(this.currentPollTimeout);
            this.currentPollTimeout = null;
        }
    }

    private handleClose(ip: string) {
        delete this.connections[ip];
        console.log("Connection ", ip, " removed!");
    }

    private async handleVote(optionId: string) {
        const option = await OptionModel.incrementVote(optionId);

        const message: WebsocketMessage = {
            event: WS_EVENTS.UPDATE_OPTION,
            data: option,
        };
        this.broadcastMessage(message);
    }

    private async handleMessage(bytes: WebSocket.RawData) {
        const parsed: WebsocketMessage = JSON.parse(bytes.toString());

        if (parsed.event === WS_EVENTS.VOTE_POLL) {
            await this.handleVote(parsed.data.id);
            return;
        }
    }

    private broadcastMessage(message: WebsocketMessage) {
        console.log("BROADCAST MESSAGE: ", message);

        Object.keys(this.connections).forEach((connection) => {
            const connectionWebsocket = this.connections[connection];
            connectionWebsocket.send(JSON.stringify(message));
        });
    }
}
