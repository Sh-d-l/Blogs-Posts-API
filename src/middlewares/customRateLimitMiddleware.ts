import {Request, Response, NextFunction} from "express";
import {rateLimitRepo} from "../repositories/rateLimitRepo";

export const customRateLimitMiddleware = async (req:Request,res:Response,next: NextFunction) => {
    let totalAttempts = 0;
    const loginAttempt = await rateLimitRepo.checkTheNumberOfLoginAttempts(req.ip,req.baseUrl)
    totalAttempts += 1;
    console.log(totalAttempts)
    if(loginAttempt && loginAttempt.IP === req.ip && loginAttempt.URL === req.baseUrl && loginAttempt.date.getSeconds() >= new Date().getSeconds() - 10) {
      console.log("not so often, bro")
        return
    }
    if(loginAttempt && loginAttempt.IP === req.ip && loginAttempt.URL === req.baseUrl && loginAttempt.date.getSeconds() >= new Date().getSeconds() - 10 && totalAttempts > 5) {
        res.sendStatus(429)
        return
    }
    else {
        next()
    }
}
