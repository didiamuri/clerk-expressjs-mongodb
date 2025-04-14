import request from 'supertest';
import express from 'express';
import errorHandler from '@src/middlewares/errorHandler';
import { unauthorizedErrorMessage } from '@src/utils/messages';
import { Locale } from '@src/utils';

const app = express();
app.use(express.json());

// Middleware for testing errors
app.get('/error', (req, res, next) => {
    const error = new Error('Something went wrong');
    (error as any).statusCode = 500;
    next(error);
});

app.get('/unauthorized', (req, res, next) => {
    const error = new Error('Unauthorized');
    (error as any).name = 'UnauthorizedError';
    (error as any).statusCode = 401;
    next(error);
});

// Adding error middleware
app.use(errorHandler);

describe('Error Handler Middleware', () => {
    it('should handle general errors', async () => {
        const response = await request(app).get('/error');
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Something went wrong');
    });

    it('should handle unauthorized errors in development', async () => {
        // Simulate a development environment
        process.env.NODE_ENV = 'development';
        const response = await request(app).get('/unauthorized');
        expect(response.status).toBe(401);
        expect(response.body.message).toBe(unauthorizedErrorMessage['en' as Locale]);
        expect(response.body.stack).toBeDefined();
    });

    it('should handle unauthorized errors in production', async () => {
        // Simulate a production environment
        process.env.NODE_ENV = 'production';
        const response = await request(app).get('/unauthorized');
        expect(response.status).toBe(401);
        expect(response.body.message).toBe(unauthorizedErrorMessage['en' as Locale]);
        expect(response.body.stack).toBeUndefined();
    });

    it('should handle unauthorized errors in default mode', async () => {
        process.env.NODE_ENV = 'test'; // Default case
        const response = await request(app).get('/unauthorized');
        expect(response.status).toBe(401);
        expect(response.body.message).toBe(unauthorizedErrorMessage['en' as Locale]);
    });
});