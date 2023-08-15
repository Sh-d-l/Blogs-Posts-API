import {Request, Response, NextFunction} from "express";
import {rateLimitRepo} from "../repositories/rateLimitRepo";

export const customRateLimitMiddleware = async (req:Request,res:Response,next: NextFunction) => {
    const rateLimitsDocument = {
        IP: req.ip,
        URL: req.originalUrl,
        date: new Date()
    }
    await rateLimitRepo.addLoginAttempt(rateLimitsDocument)
    const count = await rateLimitRepo.findTheNumberOfAttempts(req.originalUrl, req.ip)
    console.log(count)
    if( rateLimitsDocument.date.getTime() >= new Date().getTime() - 10000 && count.length > 5) {
        await rateLimitRepo.deleteDocumentsIfMoreFive(req.originalUrl, req.ip)
        res.sendStatus(429)
    }
    else {
        next()
    }
}
