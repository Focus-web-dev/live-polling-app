import PollOption from "./PollOption";

export default interface PollData {
    id: string;
    title: string;
    options: PollOption[];
    is_expired: boolean;
    expires_in: number;
    created_at: string;
}
