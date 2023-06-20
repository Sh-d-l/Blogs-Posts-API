import {emailAdapter} from "../adapters/emailAdapter";

export const emailService = {
    async transportEmailService(mail:string):Promise<boolean> {
        return await emailAdapter.transportEmailAdapter(mail)
    }
}
