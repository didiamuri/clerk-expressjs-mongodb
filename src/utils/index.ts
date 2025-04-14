
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