import {emailAdapter} from "../adapters/emailAdapter";
import {TUsersWithHashEmailDb} from "../types/types";
import {UpdateResult} from "mongodb";

export const emailManager = {
    async transportEmailManager(mail: string, user: TUsersWithHashEmailDb): Promise<boolean> {
        return await emailAdapter.transportEmailAdapterRegistration(mail, user)
    },
    async transportEmailResendingManager(mail: string, user: TUsersWithHashEmailDb): Promise<boolean> {
        return await emailAdapter.transportEmailAdapterResending(mail, user)
    }
}
