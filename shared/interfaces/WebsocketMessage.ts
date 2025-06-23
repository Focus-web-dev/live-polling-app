import { WS_EVENTS } from "../enums/WS_EVENTS";

export default interface WebsocketMessage {
    event: WS_EVENTS;
    data?: any;
}
