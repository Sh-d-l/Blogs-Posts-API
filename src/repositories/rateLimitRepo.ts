import {TypeCustomRateLimit} from "../types/types";
import {CreateRateLimitDocumentModel} from "../mongoDB/db";

class RateLimitRepo {
    async addLoginAttempt(document:TypeCustomRateLimit) {
        await CreateRateLimitDocumentModel.create(document)
    }
    async findTheNumberOfAttempts(originalUrl:string, IP:string) {
        return CreateRateLimitDocumentModel.find({URL:originalUrl, IP})
    }
    async deleteDocumentsIfMoreFive(originalUrl:string, IP:string) {
        await CreateRateLimitDocumentModel.deleteMany({URL:originalUrl, IP})
    }
}
export const rateLimitRepo = new RateLimitRepo()