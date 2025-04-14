import { AppError } from "@src/utils";
import { NextFunction, Request, Response } from "express";
import { RateLimiterMemory } from "rate-limiter-flexible";

const limiter = new RateLimiterMemory({
    points: 10, // maximum number of requests allowed
    duration: 60, // time frame in seconds
});

export default function rateLimiter(req: Request, res: Response, next: NextFunction) {
    limiter.consume(req.ip)
        .then(() => {
            next();
        })
        .catch(() => {
            next(new AppError(`Too many requests sent to the server, please try again later.`, 429));
        });
}