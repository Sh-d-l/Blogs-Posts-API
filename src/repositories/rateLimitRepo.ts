import {customRateLimitCollection} from "../mongoDB/db";
import {TypeCustomRateLimit} from "../types/types";

export const rateLimitRepo = {
    async addLoginAttempt(document:TypeCustomRateLimit) {
        await customRateLimitCollection.insertOne(document)
    },
    async findTheNumberOfAttempts(originalUrl:string, IP:string) {
        return await customRateLimitCollection.find({URL:originalUrl, IP}).toArray()
    },
    async deleteDocumentsIfMoreFive(originalUrl:string, IP:string) {
        await customRateLimitCollection.deleteMany({URL:originalUrl, IP})
    }
}