export interface WebhookLog {
    _id: string;
    eventId: string;
    eventType: string;
    status: string;
    receivedAt: Date;
    createdAt?: Date;
    updatedAt?: Date;

    isDuplicateEvent(eventId: string): Promise<boolean>;
    markEventProcessed(eventId: string, eventType: string): Promise<void>;
}