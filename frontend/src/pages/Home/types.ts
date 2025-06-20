import type PollData from "@shared/interfaces/PollData";
import type PollOption from "@shared/interfaces/PollOption";

export interface PollOptionProps {
    index: number;
    option: PollOption;
    percentage: string;
    disabled?: boolean;
    onVote: (id: string) => void;
}

export interface PollQueueProps {
    pollQueue: Exclude<PollData, "options">[];
}

export interface LivePollProps {
    currentPoll: Exclude<PollData, "options"> | null;
    currentPollOptions: PollOptionProps["option"][];
    votePercentageMap: Record<string, string>;
    totalVotes: number;
    currentPollExpiresAt: number | null;
    onVote: (optionId: string) => void;
}
