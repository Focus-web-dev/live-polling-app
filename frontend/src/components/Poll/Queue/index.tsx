import React from "react";
import { NavLink } from "react-router-dom";

import type { PollQueueProps } from "./types";

const PollQueue: React.FC<PollQueueProps> = ({ pollQueue }) => {
    return (
        <section className="segment max-h-2/5 h-full w-full">
            <div className="flex h-full min-h-0 flex-col gap-5">
                <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
                    <h3>Poll queue</h3>

                    <NavLink to="/poll/create" className="button w-full text-center sm:w-fit">
                        Create a poll
                    </NavLink>
                </div>

                <div className="bg-primary mx-2 h-full max-h-full min-h-0 w-full overflow-x-auto rounded-xl p-5">
                    {!pollQueue.length ? (
                        <div className="flex h-full w-full items-center justify-center rounded-xl">
                            <p className="font-medium md:text-xl">There no any polls in queue</p>
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
};

export default PollQueue;
