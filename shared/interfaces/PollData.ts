export default interface PollData {
    id: string;
    title: string;
    is_expired: boolean;
    expires_in: number;
    created_at: string;
}
