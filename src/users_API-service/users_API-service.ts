import {TUsersDb} from "../users_API-repositories/usersRepositoriesQuery";
import {randomUUID} from "crypto";
import {usersRepoDb} from "../users_API-repositories/users_API-repositories-db";

export const usersService = {
    async createUserService (login:string, password:string, email:string): Promise<TUsersDb> {
        const newUser:TUsersDb = {
            id: randomUUID(),
            login,
            email,
            createdAt: new Date().toISOString(),
        }
        await usersRepoDb.createNewUser(newUser)
    return newUser;
},
    async deleteUserById (id:string):Promise<boolean> {
        return await usersRepoDb.deleteUserById(id)
    }
}