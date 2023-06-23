import {TUsersDb} from "../users_API-repositories/usersRepositoriesQuery";
import {randomUUID} from "crypto";
import {TUsersWithHashEmailDb, usersRepoDb} from "../users_API-repositories/users_API-repositories-db";
import {TUsersWithHashDb} from "../users_API-repositories/users_API-repositories-db";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from 'uuid';
import add from 'date-fns/add'
import {emailManager} from "../domain/emailManager";

export const usersService = {

    async createUserServiceWithEmail(login: string, password: string, email: string): Promise<TUsersDb> {
        const userHash = await bcrypt.hash(password, 10)
        const newUser: TUsersDb = {
            id: randomUUID(),
            login,
            email,
            createdAt: new Date().toISOString(),
        }
        const newUserWithHashMail: TUsersWithHashEmailDb = {
            ...newUser,
            userHash,
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationTime: add(new Date(), {
                    hours: 0,
                    minutes: 3,
                }),
                isConfirmed: false,
            }
        }
        await usersRepoDb.createNewUserEmail(newUserWithHashMail)
        try {
            await emailManager.transportEmailManager(email, newUserWithHashMail)
        } catch (error) {
            console.log(error)
            await usersRepoDb.deleteUserById(newUserWithHashMail.id)
        }
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

    async confirmationCodeService(code: string): Promise<boolean> {
        const user = await usersRepoDb.findUserByCode(code)
        if (!user) {
            return false
        }
        if (user.emailConfirmation.confirmationCode !== code) {
            return false
        }
        if (user.emailConfirmation.expirationTime < new Date()) {
            return false
        }
        await usersRepoDb.changeIsConfirmed(user.id)
        return true
    },
    async resendingEmailService(email: string): Promise<boolean> {
        const previouslyRegisteredUserWithMail = await usersRepoDb.findUserByEmail(email)
        if (previouslyRegisteredUserWithMail && previouslyRegisteredUserWithMail.emailConfirmation.isConfirmed) {
            return false
        }
        if (previouslyRegisteredUserWithMail && previouslyRegisteredUserWithMail.emailConfirmation.expirationTime < new Date()) {
            return false
        }
        if (previouslyRegisteredUserWithMail && !previouslyRegisteredUserWithMail.emailConfirmation.isConfirmed) {
            try {
                await emailManager.transportEmailManager(email, previouslyRegisteredUserWithMail)
            } catch (error) {
                console.log(error)
            }
        }
        return true
    },

    async deleteUserById(id: string): Promise<boolean> {
        return await usersRepoDb.deleteUserById(id)
    }
}