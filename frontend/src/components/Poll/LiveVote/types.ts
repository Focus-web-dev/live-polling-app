import type PollData from "@shared/interfaces/PollData";
import type PollOption from "@shared/interfaces/PollOption";

export interface PollLiveVoteProps {
    currentPoll: PollData | null;
    currentPollOptions: PollOption[];
    votePercentageMap: Record<string, string>;
    totalVotes: number;
    currentPollExpiresAt: number | null;
    onVote: (optionId: string) => void;
    votedOptionId?: string | null;
    hasVoted?: boolean;
}

export interface PollOptionProps {
    index: number;
    option: PollOption;
    percentage: string;
    isVoted: boolean;
    onVote: (id: string) => void;
    disabled?: boolean;
}
