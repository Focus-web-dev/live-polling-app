import useWebSocket, { type Options } from "react-use-websocket";

import type WebsocketMessage from "@shared/interfaces/WebsocketMessage";
import { WS_EVENTS } from "@shared/enums/WS_EVENTS";
import { useState } from "react";
import type PollData from "@shared/interfaces/PollData";
import type PollOption from "@shared/interfaces/PollOption";

const WS_BASE_URL: string = import.meta.env.VITE_WS_BASE_URL || "";

const useVoteWebsocket = () => {
    const [currentPoll, setCurrentPoll] = useState<Exclude<PollData, "options"> | null>(null);
    const [currentPollOptions, setCurrentPollOptions] = useState<PollOption[]>([]);

    const clearState = () => {
        setCurrentPoll(null);
        setCurrentPollOptions([]);
    };

    const handleMessage = (event: WebSocketEventMap["message"]) => {
        const parsed: WebsocketMessage = JSON.parse(event.data);

        if (parsed.event === WS_EVENTS.SWITCH_POLL) {
            if (!parsed.data) {
                clearState();
                return;
            }

            const messageData: { poll: Exclude<PollData, "options">; options: PollOption[] } =
                parsed.data;

            setCurrentPoll(messageData.poll);
            setCurrentPollOptions(messageData.options);
            return;
        }

        if (parsed.event === WS_EVENTS.UPDATE_OPTION) {
            if (!parsed.data) {
                return;
            }

            const optionData: PollOption = parsed.data;

            const newOptionsArray = [...currentPollOptions];
            const index = newOptionsArray.findIndex((option) => option.id === optionData.id);
            newOptionsArray.splice(index, 1, optionData);
            setCurrentPollOptions(newOptionsArray);
        }

        if (parsed.event === WS_EVENTS.POLL_QUEUE_END) {
            clearState();
            return;
        }

        return;
    };

    const websocketOptions: Options = {
        share: true,
        onMessage: handleMessage,
    };

    const websocket = useWebSocket(WS_BASE_URL, websocketOptions);
    return { websocket, currentPoll, currentPollOptions };
};

export default useVoteWebsocket;
