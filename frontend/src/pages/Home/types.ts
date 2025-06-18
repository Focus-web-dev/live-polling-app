import type PollOption from "@shared/interfaces/PollOption";

export interface PollOptionProps {
    index: number;
    option: PollOption;
    percentage: string;
    onVote: (id: string) => void;
}
