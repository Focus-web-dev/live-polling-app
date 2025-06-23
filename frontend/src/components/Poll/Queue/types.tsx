import type PollData from "@shared/interfaces/PollData";

export interface PollQueueProps {
    pollQueue: Exclude<PollData, "options">[];
}
