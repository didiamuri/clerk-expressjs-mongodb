import crypto from "node:crypto";
import {Response} from "express";
import {WebhookLog} from "@src/models";

const i18n = {
    defaultLocale: 'en',
    locales: ['fr', 'en']
} as const

export type Locale = (typeof i18n)['locales'][number];

export class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export function normalizePort(val: any) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}

export function Respond(res: Response, id: string, message: string) {
    return res.status(200).json({
        status: 'success',
        message: `User:${id} ${message}`,
    });
}

export function generateEventId(evt:  any): string {
    const raw = `${evt.type}:${evt.data.id}:${evt.timestamp}`;
    return crypto.createHash('sha256').update(raw).digest('hex');
}

export async function isDuplicateEvent(eventId: string): Promise<boolean> {
    const existing = await WebhookLog.findOne({ eventId });
    return !!existing;
}

export async function markEventProcessed(eventId: string, eventType: string) {
    await WebhookLog.create({ eventId, eventType, status: 'processed' });
}

