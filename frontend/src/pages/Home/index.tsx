import React, { useMemo } from "react";
import { NavLink } from "react-router-dom";

import useVoteWebsocket from "../../hooks/useVoteWebsocket";
import type { LivePollProps, PollOptionProps, PollQueueProps } from "./types";
import type WebsocketMessage from "@shared/interfaces/WebsocketMessage";
import { WS_EVENTS } from "@shared/enums/WS_EVENTS";
import BaseTimer from "../../components/Base/Timer/BaseTimer";

const PollOption: React.FC<PollOptionProps> = React.memo(function PollOption({
    index,
    option,
    percentage,
    onVote,
    disabled,
}) {
    const handleClick = () => {
        if (!disabled) {
            onVote(option.id);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (!disabled && e.key === "Enter") {
            onVote(option.id);
        }
    };

    return (
        <div className="flex flex-row gap-2 rounded-sm">
            <div className="border-secondary flex h-12 w-12 items-center justify-center rounded-xl border-2">
                <span>{index + 1}</span>
            </div>

            <button
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                aria-label={`Vote for option ${option.text}`}
                tabIndex={0}
                disabled={disabled}
                className="bg-primary group relative flex w-full cursor-pointer flex-row items-center justify-between rounded-xl px-4 text-start"
            >
                <span>{option.text}</span>

                <div className="flex flex-row items-center gap-4">
                    <span className="text-white/50">{option.votes} votes</span>
                    <span>{percentage}%</span>
                </div>

                <div
                    className="bg-secondary absolute left-0 top-0 h-full rounded-xl opacity-25 transition-all group-hover:!w-full group-hover:opacity-50"
                    style={{ width: `${percentage}%` }}
                ></div>
            </button>
        </div>
    );
});

const PollQueue: React.FC<PollQueueProps> = React.memo(function PollQueue({ pollQueue }) {
    return (
        <section className="segment max-h-2/5 h-full w-full">
            <div className="flex h-full min-h-0 flex-col gap-5">
                <div className="flex flex-row items-center justify-between">
                    <h3>Poll queue</h3>

                    <NavLink to="/poll/create" className="button">
                        Create a poll
                    </NavLink>
                </div>

                <div className="bg-primary mx-2 h-full max-h-full min-h-0 w-full overflow-x-auto rounded-xl p-5">
                    {!pollQueue.length ? (
                        <div className="flex h-full w-full items-center justify-center rounded-xl">
                            <p className="text-xl font-medium">There no any polls in queue</p>
                        </div>
                    ) : (
                        <ul className="flex h-full flex-row gap-5">
                            {pollQueue.map((poll, index) => (
                                <li
                                    key={poll.id}
                                    className="segment flex shrink-0 flex-col gap-2 bg-gray-100 p-4"
                                >
                                    <div className="flex flex-row items-center gap-2">
                                        <div className="bg-secondary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                                            <span>{index + 1}</span>
                                        </div>

                                        <p className="line-clamp-2 overflow-ellipsis font-medium">
                                            {poll.title}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </section>
    );
});

const LivePoll: React.FC<LivePollProps> = React.memo(function LivePoll({
    currentPoll,
    currentPollOptions,
    votePercentageMap,
    totalVotes,
    onVote,
    currentPollExpiresAt,
}) {
    return (
        <section className="segment flex h-3/5 w-full flex-col gap-5">
            <h3>Live poll</h3>
            {currentPoll ? (
                <div className="border-primary flex flex-col gap-5 rounded-xl border-2 p-5">
                    <div className="flex flex-col gap-2">
                        <p className="text-center text-2xl">{currentPoll.title}</p>

                        <div className="text-center">
                            <BaseTimer expiresAt={currentPollExpiresAt || 0} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <ul className="flex flex-col gap-2">
                            {currentPollOptions.map((option, index) => (
                                <li key={`${currentPoll.id}-${option.id}`}>
                                    <PollOption
                                        option={option}
                                        index={index}
                                        percentage={votePercentageMap[option.id]}
                                        onVote={onVote}
                                        disabled={!currentPoll}
                                    />
                                </li>
                            ))}
                        </ul>

                        <p className="text-right font-bold text-white/50">{totalVotes} votes</p>
                    </div>
                </div>
            ) : (
                <div className="bg-primary flex h-full w-full flex-col gap-4 rounded-xl p-5">
                    <div className="lazy-loading w-full rounded-xl bg-gray-100 p-2">
                        <p className="text-center font-medium">Waiting for a new poll...</p>
                    </div>

                    <div className="lazy-loading h-full w-full rounded-xl bg-gray-100"></div>
                </div>
            )}
        </section>
    );
});

const HomePage: React.FC = () => {
    const { pollQueue, currentPoll, currentPollOptions, websocket, currentPollExpiresAt } =
        useVoteWebsocket();

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
        if (!currentPoll) {
            return;
        }
        const message: WebsocketMessage = {
            event: WS_EVENTS.VOTE_POLL,
            data: { id: optionId, poll_id: currentPoll.id },
        };
        websocket.sendJsonMessage(message);
    };

    return (
        <div className="max-w-2/3 mx-auto flex w-full flex-col gap-5 p-10">
            <PollQueue pollQueue={pollQueue} />
            <LivePoll
                currentPoll={currentPoll}
                currentPollOptions={currentPollOptions}
                votePercentageMap={votePercentageMap}
                totalVotes={totalVotes}
                onVote={handleOptionVote}
                currentPollExpiresAt={currentPollExpiresAt}
            />
        </div>
    );
};

export default HomePage;
