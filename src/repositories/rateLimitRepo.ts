import {customRateLimitCollection} from "./db";
import {TypeCustomRateLimit} from "../types/types";

export const rateLimitRepo = {
    async addLoginAttempt(document:TypeCustomRateLimit) {
        await customRateLimitCollection.insertOne(document)
    },
    async checkTheNumberOfLoginAttempts(ip:string,url:string):Promise<TypeCustomRateLimit | null> {
        return await customRateLimitCollection.findOne({IP:ip,URL:url})
    },
    // async addToArrAttempts(attempt:number) {
    //     const arrAttempts
    // }
}