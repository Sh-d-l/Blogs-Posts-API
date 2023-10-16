import {Request, Response, NextFunction} from "express";
import {rateLimitRepo} from "../repositories/rateLimitRepo";
import {TypeCustomRateLimit} from "../types/types";

export const customRateLimitMiddleware = async (req:Request,res:Response,next: NextFunction) => {
    const rateLimitsDocument:TypeCustomRateLimit = {
        IP: req.ip,
        URL: req.originalUrl,
        date: new Date()
    }
    await rateLimitRepo.addLoginAttempt(rateLimitsDocument)
    const count = await rateLimitRepo.findTheNumberOfAttempts(req.originalUrl, req.ip)
    if( rateLimitsDocument.date.getTime() >= new Date().getTime() - 10001 && count.length > 5) {
        await rateLimitRepo.deleteDocumentsIfMoreFive(req.originalUrl, req.ip)
        res.sendStatus(429)
    }
    else {
        next()
    }
}
