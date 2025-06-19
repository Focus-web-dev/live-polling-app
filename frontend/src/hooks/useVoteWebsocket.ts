import useWebSocket, { type Options } from "react-use-websocket";

import type WebsocketMessage from "@shared/interfaces/WebsocketMessage";
import { WS_EVENTS } from "@shared/enums/WS_EVENTS";
import { useState } from "react";
import type PollData from "@shared/interfaces/PollData";
import type PollOption from "@shared/interfaces/PollOption";

const WS_BASE_URL: string = import.meta.env.VITE_WS_BASE_URL || "";

const useVoteWebsocket = () => {
    const [pollQueue, setPollQueue] = useState<Exclude<PollData, "options">[]>([]);
    const [currentPoll, setCurrentPoll] = useState<Exclude<PollData, "options"> | null>(null);
    const [currentPollOptions, setCurrentPollOptions] = useState<PollOption[]>([]);

    const clearState = () => {
        setCurrentPoll(null);
        setCurrentPollOptions([]);
    };

    const handleClose = () => {
        console.log("CLOSE");
    };

    const handleMessage = (event: WebSocketEventMap["message"]) => {
        const parsed: WebsocketMessage = JSON.parse(event.data);

        console.log("MESSAGE: ", parsed.event);

        if (parsed.event === WS_EVENTS.SWITCH_POLL) {
            if (!parsed.data) {
                clearState();
            }

            const messageData: { poll: Exclude<PollData, "options">; options: PollOption[] } =
                parsed.data;

            console.log("POLL: ", messageData.poll);

            setCurrentPoll(messageData.poll);
            setCurrentPollOptions(messageData.options);
        }

        if (parsed.event === WS_EVENTS.UPDATE_OPTION && parsed.data) {
            const optionData: PollOption = parsed.data;

            const newOptionsArray = [...currentPollOptions];
            const index = newOptionsArray.findIndex((option) => option.id === optionData.id);
            newOptionsArray.splice(index, 1, optionData);
            setCurrentPollOptions(newOptionsArray);
        }

        if (parsed.event === WS_EVENTS.UPDATE_POLL_QUEUE) {
            const pollQueue: Exclude<PollData, "options">[] = parsed.data;
            if (!pollQueue || !pollQueue.length) {
                setPollQueue([]);
                clearState();
            }

            setPollQueue(parsed.data);
        }

        return;
    };

    const websocketOptions: Options = {
        share: true,
        onMessage: handleMessage,
        onClose: handleClose,
        shouldReconnect: () => true,
    };

    const websocket = useWebSocket(WS_BASE_URL, websocketOptions);
    return { websocket, pollQueue, currentPoll, currentPollOptions };
};

export default useVoteWebsocket;
