import {RequestHandler} from 'express';
import {HttpContext} from "@src/types";

export const routeHandler = (controller: any, methodName: string): RequestHandler => {
    return async (req, res, next) => {
        const context: HttpContext = {req, res, next};
        return controller[methodName].bind(controller)(context);
    };
};