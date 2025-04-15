// /routes/index.ts
import fs from "fs";
import path from "path";
import express from "express";
import logger from "@src/utils/logger";
import {bodyParser} from "@src/middlewares";
import {format, formatDistanceToNow} from "date-fns";

const routesDir = path.join(__dirname);

export async function initRouter(): Promise<express.Router> {
    const router = express.Router();

    // Health check route
    router.get("/health", ...bodyParser, (_req, res) => {
        logger.info("Health check OK", {label: "Health"});
        res.status(200).json({
            status: "running...",
            name: process.env.npm_package_name,
            uptime: formatDistanceToNow(new Date(Date.now() - process.uptime() * 1000)),
            date: format(new Date(), "PPPP HH:mm"),
            node: process.version
        });
    });

    // Autoload all routes files
    const routeFiles = fs.readdirSync(routesDir).filter(file => {
        const ext = path.extname(file);
        return file !== `index${ext}` && (ext === ".ts" || ext === ".js");
    });

    for (const file of routeFiles) {
        try {
            const routeModule = await import(path.join(routesDir, file));
            const {prefix, router: subRouter} = routeModule.default || {};
            if (prefix && subRouter) {
                router.use(prefix, subRouter);
                logger.info(`✅ Route mounted: ${prefix}`, {label: "Routing"});
            }
        } catch (err: any) {
            logger.error(`❌ Failed to load route file "${file}": ${err.message}`, {
                stack: err.stack,
                label: "Routing"
            });
        }
    }

    logger.info("✅ All routes loaded successfully.", {label: "Routing"});

    return router;
}