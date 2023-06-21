import {emailAdapter} from "../adapters/emailAdapter";
import {TUsersWithHashEmailDb} from "../users_API-repositories/users_API-repositories-db";

export const emailManager = {
    async transportEmailManager(mail:string, user:TUsersWithHashEmailDb):Promise<boolean> {
        return await emailAdapter.transportEmailAdapter(mail,user)
    }
}
