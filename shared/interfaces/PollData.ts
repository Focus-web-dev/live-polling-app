import PollOption from "./PollOption";

export default interface PollData {
    id: string;
    title: string;
    options: PollOption[];
    createdAt: string;
    expiresIn: string;
}
