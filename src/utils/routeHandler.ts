import {RequestHandler} from 'express';
import {IHttpContext} from "@src/types";

export const routeHandler = (controller: any, methodName: string): RequestHandler => {
    return async (req, res, next) => {
        const context: IHttpContext = {req, res, next};
        return controller[methodName].bind(controller)(context);
    };
};