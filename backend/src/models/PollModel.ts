import { BaseModel } from "./BaseModel";
import { DB_TABLE_NAMES } from "../enums/DB_TABLE_NAMES";
import PollData from "@shared/interfaces/PollData";

type PollInsert = Omit<PollData, "created_at" | "is_expired" | "expires_in">;

class PollModel extends BaseModel<PollData, PollInsert> {
    constructor() {
        super(DB_TABLE_NAMES.POLLS);
    }
}

export default new PollModel();
