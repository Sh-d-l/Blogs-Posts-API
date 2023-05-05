import {TUsersDb} from "../users_API-repositories/usersRepositoriesQuery";
import {randomUUID} from "crypto";
import {usersRepoDb} from "../users_API-repositories/users_API-repositories-db";
import {TUsersWithHashDb} from "../users_API-repositories/users_API-repositories-db";
import bcrypt from "bcrypt";

export const usersService = {

    async createUserService(login: string, password: string, email: string): Promise<TUsersDb> {
        const userHash = await bcrypt.hash(password, 10)
        const newUser: TUsersDb = {
            id: randomUUID(),
            login,
            email,
            createdAt: new Date().toISOString(),
        }
        const newUserWithHash: TUsersWithHashDb = {
            ...newUser,
            userHash,
        }
        await usersRepoDb.createNewUser(newUserWithHash)
        return newUser;
    },

    async authUserService(loginOrEmail: string, password: string): Promise<boolean> {
        const user: TUsersWithHashDb | null = await usersRepoDb.findUserByLoginEmail(loginOrEmail)
        if(!user) return false;
        const checkUserHash: boolean = await bcrypt.compare(password, user.userHash)
        if(checkUserHash) {
            return true;
        }
        else {
            return false;
        }
    },

    async deleteUserById(id: string): Promise<boolean> {
        return await usersRepoDb.deleteUserById(id)
    }
}