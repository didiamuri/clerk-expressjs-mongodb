import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const isProduction = process.env.NODE_ENV === "production";

const logFormatConsole = winston.format.printf(({ level, message, timestamp, label }) => {
    return `[${timestamp}] [${label}] ${level.toUpperCase()}: ${message}`;
});

const logger = winston.createLogger({
    level: isProduction ? "info" : "debug",
    format: isProduction
        ? winston.format.combine(
            winston.format.label({ label: "App" }),
            winston.format.timestamp(),
            winston.format.json()
        )
        : winston.format.combine(
            winston.format.colorize(),
            winston.format.label({ label: "App" }),
            winston.format.timestamp(),
            logFormatConsole
        ),
    transports: [
        new winston.transports.Console(),
        new DailyRotateFile({
            filename: "logs/app-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "10m",
            maxFiles: "14d",
        }),
    ],
});

export default logger;