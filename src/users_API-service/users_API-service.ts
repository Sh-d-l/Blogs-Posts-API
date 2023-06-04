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

    async authUserService(loginOrEmail: string, password: string): Promise<TUsersDb | null> {
        const user: TUsersWithHashDb | null = await usersRepoDb.findUserByLoginEmail(loginOrEmail)
        if (!user) return null;
        const checkUserHash: boolean = await bcrypt.compare(password, user.userHash)
        if (checkUserHash) {
            return {
                id: randomUUID(),
                login: user.login,
                email: user.email,
                createdAt: new Date().toISOString(),
            }
        } else {
            return null;
        }
    },
    async findUserByIdService(userId: string): Promise<TUsersDb | null> {
        const user: TUsersWithHashDb | null = await usersRepoDb.findUserByUserId(userId)
        if (user) {
           return {
                id: user.id,
                login: user.login,
                email: user.email,
                createdAt: new Date().toISOString(),
            }
        } else {
            return null;
        }
    },

    async deleteUserById(id: string): Promise<boolean> {
        return await usersRepoDb.deleteUserById(id)
    }
}