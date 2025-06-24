import React, { useMemo } from "react";

import PollQueue from "@/components/Poll/Queue";
import PollLiveVote from "@/components/Poll/LiveVote";

import useVoteWebsocket from "@/hooks/useVoteWebsocket";

import type WebsocketMessage from "@shared/interfaces/WebsocketMessage";
import { WS_EVENTS } from "@shared/enums/WS_EVENTS";

const HomePage: React.FC = () => {
    const {
        pollQueue,
        currentPoll,
        currentPollOptions,
        websocket,
        currentPollExpiresAt,
        currentVotedOption,
        setCurrentVotedOption,
    } = useVoteWebsocket();

    const hasVoted = useMemo(() => !!currentVotedOption, [currentVotedOption]);

    const totalVotes = useMemo(() => {
        if (!currentPollOptions || !currentPollOptions.length) {
            return 0;
        }
        return currentPollOptions.reduce((sum, option) => sum + option.votes, 0);
    }, [currentPollOptions]);

    const votePercentageMap = useMemo(() => {
        const map: Record<string, string> = {};
        if (!currentPollOptions || !currentPollOptions.length) {
            return map;
        }
        currentPollOptions.forEach((option) => {
            if (option.votes === 0) {
                map[option.id] = "0";
                return;
            }
            map[option.id] = ((option.votes / totalVotes) * 100).toFixed(1);
        });
        return map;
    }, [currentPollOptions, totalVotes]);

    const handleOptionVote = (optionId: string) => {
        if (!currentPoll || hasVoted) {
            return;
        }

        setCurrentVotedOption(optionId);

        const message: WebsocketMessage = {
            event: WS_EVENTS.VOTE_POLL,
            data: { id: optionId, poll_id: currentPoll.id },
        };

        websocket.sendJsonMessage(message);
    };

    return (
        <div className="lg:max-w-2/3 mx-auto flex w-full flex-col gap-5">
            <PollQueue pollQueue={pollQueue} />
            <PollLiveVote
                currentPoll={currentPoll}
                currentPollOptions={currentPollOptions}
                votePercentageMap={votePercentageMap}
                totalVotes={totalVotes}
                onVote={handleOptionVote}
                currentPollExpiresAt={currentPollExpiresAt}
                votedOptionId={currentVotedOption}
                hasVoted={hasVoted}
            />
        </div>
    );
};

export default HomePage;
