import { useState } from "react";
import useWebSocket, { type Options } from "react-use-websocket";

import type WebsocketMessage from "@shared/interfaces/WebsocketMessage";
import { WS_EVENTS } from "@shared/enums/WS_EVENTS";
import type PollData from "@shared/interfaces/PollData";
import type PollOption from "@shared/interfaces/PollOption";

const WS_BASE_URL: string = import.meta.env.VITE_WS_BASE_URL || "";

type UseVoteWebsocketReturn = {
    websocket: ReturnType<typeof useWebSocket>;
    pollQueue: Exclude<PollData, "options">[];
    currentPoll: Exclude<PollData, "options"> | null;
    currentPollOptions: PollOption[];
    currentPollExpiresAt: number | null;
    currentVotedOption: string | null;
    setCurrentVotedOption: (optionId: string | null) => void;
};

const useVoteWebsocket = (): UseVoteWebsocketReturn => {
    const [pollQueue, setPollQueue] = useState<Exclude<PollData, "options">[]>([]);
    const [currentPoll, setCurrentPoll] = useState<Exclude<PollData, "options"> | null>(null);
    const [currentPollOptions, setCurrentPollOptions] = useState<PollOption[]>([]);
    const [currentPollExpiresAt, setCurrentPollExpiresAt] = useState<number | null>(null);
    const [currentVotedOption, setCurrentVotedOption] = useState<string | null>(null);

    const clearState = () => {
        setCurrentPoll(null);
        setCurrentPollOptions([]);
        setCurrentPollExpiresAt(null);
    };

    const handleSwitchPoll = (data: {
        poll: Exclude<PollData, "options">;
        options: PollOption[];
        expiresAt: number;
        votedOption: string | null;
    }) => {
        setCurrentPoll(data.poll);
        setCurrentPollOptions(data.options);
        setCurrentPollExpiresAt(data.expiresAt);
        setCurrentVotedOption(data.votedOption);
    };

    const handleUpdateOption = (optionData: PollOption) => {
        setCurrentPollOptions((prevOptions) => {
            const index = prevOptions.findIndex((option) => option.id === optionData.id);

            if (index === -1) {
                return prevOptions;
            }

            const newOptions = [...prevOptions];
            newOptions[index] = optionData;

            return newOptions;
        });
    };

    const handleUpdatePollQueue = (data: Exclude<PollData, "options">[]) => {
        if (!data || !data.length) {
            setPollQueue([]);
            clearState();
        }
        setPollQueue(data);
    };

    const handleMessage = (event: WebSocketEventMap["message"]) => {
        const parsed: WebsocketMessage = JSON.parse(event.data);

        if (parsed.event === WS_EVENTS.SWITCH_POLL) {
            if (!parsed.data) {
                clearState();
                return;
            }
            handleSwitchPoll(parsed.data);
            return;
        }

        if (parsed.event === WS_EVENTS.UPDATE_OPTION && parsed.data) {
            handleUpdateOption(parsed.data);
            return;
        }

        if (parsed.event === WS_EVENTS.UPDATE_POLL_QUEUE) {
            handleUpdatePollQueue(parsed.data);
            return;
        }
    };

    const websocketOptions: Options = {
        share: true,
        onMessage: handleMessage,
        shouldReconnect: () => true,
    };

    const websocket = useWebSocket(WS_BASE_URL, websocketOptions);
    return {
        websocket,
        pollQueue,
        currentPoll,
        currentPollOptions,
        currentPollExpiresAt,
        currentVotedOption,
        setCurrentVotedOption,
    };
};

export default useVoteWebsocket;
