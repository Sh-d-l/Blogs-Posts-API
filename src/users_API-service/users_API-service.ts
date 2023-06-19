import {TUsersDb} from "../users_API-repositories/usersRepositoriesQuery";
import {randomUUID} from "crypto";
import {TUsersWithHashEmailDb, usersRepoDb} from "../users_API-repositories/users_API-repositories-db";
import {TUsersWithHashDb} from "../users_API-repositories/users_API-repositories-db";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from 'uuid';
import add from 'date-fns/add'
import {emailService} from "../domain/emailService";

export const usersService = {

    async createUserServiceWithEmail(login: string, password: string, email: string): Promise<TUsersDb> {
        const userHash = await bcrypt.hash(password, 10)
        const newUser: TUsersDb = {
            id: randomUUID(),
            login,
            email,
            createdAt: new Date().toISOString(),
        }
        const newUserWithHash: TUsersWithHashEmailDb = {
            ...newUser,
            userHash,
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationTime: add(new Date(), {
                    hours: 3,
                    minutes: 3,
                }),
                isConfirmed: false,
            }
        }
        await usersRepoDb.createNewUser(newUserWithHash)
        await emailService.transportEmailService(email)
        return newUser;
    },

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
                id: user.id,
                login: user.login,
                email: user.email,
                createdAt: user.createdAt
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