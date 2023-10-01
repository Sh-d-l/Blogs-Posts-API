import {emailAdapter} from "../adapters/emailAdapter";
import {TUsersWithHashEmailDb, TypeRecoveryCode} from "../types/types";

export const emailManager = {
    async transportEmailManager(email: string, user: TUsersWithHashEmailDb): Promise<boolean> {
        return await emailAdapter.transportEmailAdapter(email, user)
    },
    async transportEmailManagerPasswordRecovery(email: string, recoveryCode:TypeRecoveryCode): Promise<boolean> {
        return await emailAdapter.transportEmailAdapterPasswordRecovery(email, recoveryCode)
    },
}
