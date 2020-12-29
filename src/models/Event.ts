import { EventType } from "./EventType";
import { Subject } from "./Subject";
import { User } from "./User";

export interface Event {
    id: number
    start: Date
    end: Date
    eventType: EventType
    remote: Boolean
    subject: Subject
    host: User,
    createdAt: Date
    updatedAt: Date
}