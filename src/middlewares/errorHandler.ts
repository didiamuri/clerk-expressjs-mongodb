import logger from "@src/utils/logger";
import { Locale } from "@src/utils";
import { ErrorRequestHandler } from "express";
import { unauthorizedErrorMessage } from "@src/utils/messages";

const errorHandler: ErrorRequestHandler = (err, req, res, _) => {
    const statusCode = err.statusCode || 500;
    const locale = req.cookies?.locale as Locale || 'en';

    logger.error(`[${req.method}] ${req.originalUrl} -> ${err.message}`, {
        label: "ErrorHandler",
        stack: err.stack,
        statusCode,
    });

    const isUnauthorized = err.name === 'UnauthorizedError';
    const message = isUnauthorized
        ? unauthorizedErrorMessage[locale]
        : err.message;

    switch (process.env.NODE_ENV) {
        case 'development':
            res.status(isUnauthorized ? 401 : statusCode).json({
                statusCode: isUnauthorized ? 401 : statusCode,
                message,
                stack: err.stack,
            });
            break;

        case 'production':
            res.status(isUnauthorized ? 401 : statusCode).json({
                statusCode: isUnauthorized ? 401 : statusCode,
                message,
            });
            break;

        default:
            res.status(statusCode).json({
                statusCode,
                message,
            });
            break;
    }
};

export default errorHandler;