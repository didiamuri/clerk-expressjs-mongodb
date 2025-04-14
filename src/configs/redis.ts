import Redis from 'ioredis';
import logger from "@src/utils/logger";
import {NextFunction, Request, Response} from "express";

const redis = new Redis();

redis.on('connect', () => {
    logger.info('✅ Connected to Redis ');
});

redis.on('error', (err) => {
    logger.error('💥 Redis connection error:', err.message);
});

export const subscriberClient = new Redis();
export const publisherClient = new Redis();

subscriberClient.subscribe('session-events');
subscriberClient.psubscribe('__keyevent@0__:expired');

// Ajouter un token révoqué à Redis
const revokeToken = async (token: string, expiresIn: number) => {
    await redis.setex(`revoked:${token}`, expiresIn, "1");
};

// Vérifier si un token est révoqué
const isTokenRevoked = async (token: string) => {
    return await redis.get(`revoked:${token}`) !== null;
};

// Middleware Express pour vérifier la révocation
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    if (await isTokenRevoked(token)) {
        return res.status(401).json({ message: "Token revoked" });
    }

    next();
};

export default redis;