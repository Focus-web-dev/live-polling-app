import { WebSocketServer } from "ws";
import type WebSocket from "ws";

import WebsocketMessage from "@shared/interfaces/WebsocketMessage";
import { WS_EVENTS } from "@shared/enums/WS_EVENTS";

import PollService from "./PollService";
import OptionModel from "../models/OptionModel";
import PollData from "@shared/interfaces/PollData";
import PollOption from "@shared/interfaces/PollOption";

const RETRY_INTERVAL = 5000;

export default class VoteService {
    private pollQueue: Omit<PollData, "options">[] = [];
    private currentPoll: Omit<PollData, "options"> | null = null;
    private currentPollOptions: PollOption[] | null = null;
    private currentPollExpiresAt: number | null = null;
    private pollTimeout: NodeJS.Timeout | null = null;
    private pollCheckInterval: NodeJS.Timeout | null = null;
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

            if (this.currentPoll && this.currentPollExpiresAt && this.currentPollOptions) {
                const actualMessage = JSON.stringify({
                    event: WS_EVENTS.SWITCH_POLL,
                    data: {
                        poll: this.currentPoll,
                        options: this.currentPollOptions,
                        expiresAt: this.currentPollExpiresAt,
                    },
                });

                ws.send(actualMessage);
            }

            const message = {
                event: WS_EVENTS.UPDATE_POLL_QUEUE,
                data: this.pollQueue,
            };

            ws.send(JSON.stringify(message));

            ws.on("message", (message) => this.handleMessage(message));
            ws.on("close", () => this.handleClose(clientIP));
        });

        this.checkAndStartNextPoll();
    }

    private setPollQueue(newPollQueue: Omit<PollData, "options">[]): void {
        this.pollQueue = newPollQueue;
        const message = { event: WS_EVENTS.UPDATE_POLL_QUEUE, data: this.pollQueue };
        this.broadcastMessage(message);
    }

    private async checkAndStartNextPoll(): Promise<void> {
        const queue = await PollService.getNonExpired();
        if (!queue || queue.length === 0) {
            if (!this.pollCheckInterval) {
                this.pollCheckInterval = setInterval(
                    () => this.checkAndStartNextPoll(),
                    RETRY_INTERVAL
                );
            }
            return;
        }

        if (this.pollCheckInterval) {
            clearInterval(this.pollCheckInterval);
            this.pollCheckInterval = null;
        }

        this.setPollQueue(queue);
        this.activatePoll(queue[0]);
    }

    private async activatePoll(poll: Omit<PollData, "options">): Promise<void> {
        this.currentPoll = poll;
        this.currentPollOptions = await OptionModel.findAll((qb) => qb.where({ poll_id: poll.id }));
        this.currentPollExpiresAt = Date.now() + poll.expires_in * 1000;
        this.isActive = true;

        const message = {
            event: WS_EVENTS.SWITCH_POLL,
            data: {
                poll: this.currentPoll,
                options: this.currentPollOptions,
                expiresAt: this.currentPollExpiresAt,
            },
        };

        this.broadcastMessage(message);

        if (this.pollTimeout) {
            clearTimeout(this.pollTimeout);
        }

        this.pollTimeout = setTimeout(() => this.expireCurrentPoll(), poll.expires_in * 1000);
    }

    private async expireCurrentPoll(): Promise<void> {
        if (!this.currentPoll) {
            return;
        }

        await PollService.update(this.currentPoll.id, { is_expired: true });

        this.currentPoll = null;
        this.currentPollOptions = null;
        this.currentPollExpiresAt = null;
        this.isActive = false;

        this.checkAndStartNextPoll();
    }

    private clearState(): void {
        this.setPollQueue([]);
        this.currentPoll = null;
        this.currentPollOptions = null;
        this.currentPollExpiresAt = null;
        this.isActive = false;

        if (this.pollTimeout) {
            clearTimeout(this.pollTimeout);
            this.pollTimeout = null;
        }

        if (this.pollCheckInterval) {
            clearInterval(this.pollCheckInterval);
            this.pollCheckInterval = null;
        }
    }

    private handleClose(ip: string): void {
        delete this.connections[ip];
        console.log("Connection ", ip, " removed!");
    }

    private async handleVote(optionId: string): Promise<void> {
        const option = await OptionModel.incrementVote(optionId);
        const message: WebsocketMessage = { event: WS_EVENTS.UPDATE_OPTION, data: option };
        this.broadcastMessage(message);
    }

    private async handleMessage(bytes: WebSocket.RawData): Promise<void> {
        const parsed: WebsocketMessage = JSON.parse(bytes.toString());
        if (parsed.event === WS_EVENTS.VOTE_POLL) {
            await this.handleVote(parsed.data.id);
            return;
        }
    }

    private broadcastMessage(message: WebsocketMessage): void {
        console.log("BROADCAST MESSAGE: ", message);

        Object.keys(this.connections).forEach((connection) => {
            const connectionWebsocket = this.connections[connection];
            connectionWebsocket.send(JSON.stringify(message));
        });
    }

    public shutdown(): void {
        this.clearState();
        this.connections = {};
    }
}
