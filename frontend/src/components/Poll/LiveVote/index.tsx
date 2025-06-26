import React from "react";

import BaseTimer from "@/components/Base/Timer/BaseTimer";
import type { PollLiveVoteProps, PollOptionProps } from "./types";
import BaseIcon from "@/components/Base/Icon";

const PollOption: React.FC<PollOptionProps> = function ({
    index,
    option,
    percentage,
    onVote,
    disabled,
    isVoted,
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
            <div className="border-secondary flex h-10 w-10 items-center justify-center rounded-xl border-2 sm:h-12 sm:w-12">
                <span>{index + 1}</span>
            </div>

            <button
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                aria-label={`Vote for option ${option.text}`}
                tabIndex={0}
                disabled={disabled}
                className="bg-primary group relative flex w-full cursor-pointer flex-col items-center justify-between gap-2 rounded-xl px-4 text-start disabled:cursor-default sm:flex-row"
            >
                <div className="flex flex-row items-center gap-2">
                    <span>{option.text}</span>
                    {isVoted && <BaseIcon icon="tick" className="h-[1em] w-[1em] text-green-400" />}
                </div>

                <div className="flex flex-row items-center gap-4">
                    <span className="text-white/50">{option.votes} votes</span>
                    <span>{percentage}%</span>
                </div>

                {!disabled ? (
                    <div
                        className="bg-secondary absolute left-0 top-0 h-full rounded-xl opacity-25 transition-all group-hover:!w-full group-hover:opacity-50"
                        style={{ width: `${percentage}%` }}
                    ></div>
                ) : (
                    <div
                        className="bg-secondary absolute left-0 top-0 h-full rounded-xl opacity-25 transition-all"
                        style={{ width: `${percentage}%` }}
                    ></div>
                )}
            </button>
        </div>
    );
};

const PollLiveVote: React.FC<PollLiveVoteProps> = ({
    currentPoll,
    currentPollOptions,
    votePercentageMap,
    totalVotes,
    onVote,
    currentPollExpiresAt,
    votedOptionId,
    hasVoted,
}) => {
    return (
        <section className="segment flex h-3/5 w-full flex-col gap-5 overflow-y-auto">
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
                                        disabled={hasVoted}
                                        isVoted={votedOptionId === option.id}
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
};

export default PollLiveVote;
