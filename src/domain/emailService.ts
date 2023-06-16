import {emailAdapter} from "../adapters/emailAdapter";

export const emailService = {
    async transportEmailService(mail:string) {
        await emailAdapter.transportEmailAdapter(mail)
    }
}
