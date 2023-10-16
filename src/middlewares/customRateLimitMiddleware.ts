import {Request, Response, NextFunction} from "express";
import {rateLimitRepo} from "../repositories/rateLimitRepo";
import {TypeCustomRateLimit} from "../types/types";
import {CreateRateLimitDocumentModel} from "../mongoDB/db";

export const customRateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const rateLimitsDocument: TypeCustomRateLimit = {
        IP: req.ip,
        URL: req.originalUrl,
        date: new Date()
    }
    const count = await CreateRateLimitDocumentModel.countDocuments({
        IP: rateLimitsDocument.IP,
        URL: rateLimitsDocument.URL,
        date: {$gte: new Date(+rateLimitsDocument.date - 10000)}
    })
    // console.log(rateLimitsDocument.date.getTime(), "rateLimitsDocument.date.getTime()")
    // console.log(rateLimitsDocument.date.getTime() >= new Date().getTime() - 10000, "rateLimitsDocument.date.getTime() >= new Date().getTime() - 10000")
    // console.log(count.length > 5, "count.length > 5")
    if (count + 1 > 5) {
        // console.log(rateLimitsDocument.date.getTime(), "rateLimitsDocument.date.getTime()")
        // console.log(new Date().getTime(), "new Date().getTime()")
        // console.log(new Date().getTime() - 10000, "new Date().getTime() - 10000")
        // console.log(count.length, "count.length ")
        // console.log('429')
        // await rateLimitRepo.deleteDocumentsIfMoreFive(req.originalUrl, req.ip)
        return res.sendStatus(429)
    }
    // await rateLimitRepo.addLoginAttempt(rateLimitsDocument)
    await CreateRateLimitDocumentModel.create(rateLimitsDocument)
    return next()
}
