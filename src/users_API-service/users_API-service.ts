import {TUsersDb} from "../types/types";
import {randomUUID} from "crypto";
import {
    usersRepoDb
} from "../users_API-repositories/users_API-repositories-db";
import bcrypt from "bcrypt";
import {TUsersWithHashDb} from "../types/types";

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

    async deleteUserById(id: string): Promise<boolean> {
        return await usersRepoDb.deleteUserById(id)
    }
}