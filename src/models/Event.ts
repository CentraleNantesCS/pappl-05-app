import { EventType } from "./EventType";
import { Subject } from "./Subject";

export interface Event {
    id: number
    start: Date
    end: Date
    eventType: EventType
    remote: Boolean
    subject: Subject
    createdAt: Date
    updatedAt: Date
}