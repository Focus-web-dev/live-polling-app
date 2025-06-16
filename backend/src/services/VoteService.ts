import { WebSocket, WebSocketServer } from "ws";

import PollData from "@shared/interfaces/PollData";
import WS_EVENTS from "@shared/constants/WS_EVENTS";

import PollModel from "../models/PollModel";
import OptionModel from "../models/OptionModel";

export default class VoteService {
    private currentPollId: string | null = null;
    private currentPollTimeout: NodeJS.Timeout | null = null;
    private isActive = false;

    private websocketServer: WebSocketServer;

    constructor(websocketServer: WebSocketServer) {
        this.websocketServer = websocketServer;
    }

    public async start() {
        const nonExpiredPoll = await PollModel.queryNonExpiredPoll();

        if (!nonExpiredPoll) {
            this.currentPollId = null;
            this.isActive = false;
            this.broadcastQueueEnd();
            return;
        }

        this.currentPollId = nonExpiredPoll.id;
        this.isActive = true;

        this.broadcastPoll(nonExpiredPoll);

        const now = new Date();
        const createdAtMilliseconds = new Date(nonExpiredPoll.createdAt).getTime();
        const expiresInMilliseconds = Number(nonExpiredPoll.expiresIn) * 1000;

        const expiresAtMilliseconds = createdAtMilliseconds + expiresInMilliseconds;

        const delay = Math.max(0, expiresAtMilliseconds - now.getTime());

        this.currentPollTimeout = setTimeout(async () => await this.start(), delay);
    }

    private broadcastPoll(poll: PollData) {
        const message = JSON.stringify({ event: WS_EVENTS.NEXT_POLL, data: poll });

        this.websocketServer.clients.forEach((client) => {
            if (client.readyState !== WebSocket.OPEN) {
                return;
            }

            client.send(message);
        });
    }

    private broadcastQueueEnd() {
        const message = JSON.stringify({ event: WS_EVENTS.QUEUE_END });

        this.websocketServer.clients.forEach((client) => {
            if (client.readyState !== WebSocket.OPEN) {
                return;
            }

            client.send(message);
        });
    }

    public async handleVoteMessage(optionId: string) {
        return await OptionModel.incrementVote(optionId);
    }
}
