import http from "http";
import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import logger from "@src/utils/logger";
import {initRouter} from "@src/routes";
import {normalizePort} from "@src/utils";
import {connectMongodb} from '@src/configs';
import {clerkMiddleware} from '@clerk/express'
import {badUrl, cors, errorHandler, rateLimiter} from '@src/middlewares';
import {initCollections} from "@src/models";

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = normalizePort(process.env.PORT || '3001');

(async () => {
    try {
        await connectMongodb();
        await initCollections();

        app.set('trust proxy', true);
        app.set('port', PORT);

        app.use(clerkMiddleware());
        app.use(helmet());
        app.use(cors);
        app.use(rateLimiter);

        const router = await initRouter();
        app.use('/api/v1', router);
        app.all(/^.*$/, badUrl);

        // Middleware de logging
        app.use((req, _res, next) => {
            logger.info(`${req.method} ${req.originalUrl}`, {label: "HTTP"});
            next();
        });

        app.use(errorHandler);

        server.listen(PORT, () => {
            logger.info(`🚀 Server is running on port ${PORT}`);
        });
    } catch (err) {
        logger.error("💥 Startup failed:", err);
        process.exit(1);
    }
})();

// Handling global errors
process.on("unhandledRejection", (reason) => {
    logger.error("💥 Unhandled Rejection:", reason);
    process.exit(1);
});

process.on("uncaughtException", (err) => {
    logger.error("💥 Uncaught Exception:", err);
    process.exit(1);
});

export default app;
