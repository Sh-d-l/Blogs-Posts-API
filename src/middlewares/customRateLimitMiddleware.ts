import {Request, Response, NextFunction} from "express";
import {rateLimitRepo} from "../repositories/rateLimitRepo";

export const customRateLimitMiddleware = async (req:Request,res:Response,next: NextFunction) => {
    const rateLimitsDocument = {
        IP: req.ip,
        URL: req.baseUrl,
        date: new Date()
    }
    const arrAttempts = [];
    let totalAttempts = 0;
    const rateLimit = await rateLimitRepo.addLoginAttempt(rateLimitsDocument)

    const attemptsDocument = await rateLimitRepo.checkTheNumberOfLoginAttempts(req.ip,req.baseUrl)
    if (attemptsDocument) {
        console.log(attemptsDocument.date.getSeconds(), "attemptsDocument.date.getTime()")
        console.log(new Date().getSeconds() , "new Date().getTime()")
        console.log(attemptsDocument.date.getSeconds() >= new Date().getSeconds() - 10, "attemptsDocument.date.getSeconds() >= new Date().getSeconds() - 10")
    }
    if(attemptsDocument && attemptsDocument.IP === req.ip && attemptsDocument.URL === req.baseUrl && attemptsDocument.date.getTime() >= new Date().getTime() - 10000 && arrAttempts.length > 5) {
        totalAttempts += 1
        res.sendStatus(429)
        return
    }
    else {
        next()
    }
}
