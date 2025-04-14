import { Request, Response, NextFunction } from 'express';

export interface HttpContext {
    req: Request;
    res: Response;
    next: NextFunction;
}