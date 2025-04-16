import mongoose from 'mongoose';
import {WebhookLog} from "@src/types";

const schema = new mongoose.Schema<WebhookLog>({
        eventId: { type: String, index: true, unique: true, required: true },
        eventType: { type: String, required: true },
        status: { type: String, enum: ['processed', 'failed'], default: 'processed' },
        receivedAt: { type: Date, default: Date.now },
    }, {
    timestamps: true
});

schema.set("toJSON", { virtuals: false, versionKey: false });

export default mongoose.model<WebhookLog>('WebhookLog', schema, 'webhook_logs');