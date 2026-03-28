import { type Request, Response, NextFunction, RequestHandler } from "express"

type Handler = (req: Request, res: Response, next: NextFunction) => Promise<any>

export function async_handler(handler: Handler): RequestHandler {
    return function (req, res, next) {
        Promise.resolve(handler(req, res, next)).catch(next)
    }
}
