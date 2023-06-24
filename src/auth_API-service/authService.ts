import {TUsersDb} from "../types/types";
import {randomUUID} from "crypto";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from 'uuid';
import add from 'date-fns/add'
import {emailManager} from "../domain/emailManager";
import {authRepoDB} from "../auth_API-repositories/authRepoDB";
import {TUsersWithHashDb, TUsersWithHashEmailDb} from "../types/types";

export const authWithMailService = {

    async createUserWithEmailService(login: string, password: string, email: string): Promise<TUsersDb | null> {
        // const previouslyRegisteredUser = await authRepoDB.findUserByEmail(email)
        // if (previouslyRegisteredUser) {
        //     return null
        // }
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
        await authRepoDB.createNewUserEmail(newUserWithHashMail)
        try {
            await emailManager.transportEmailManager(email, newUserWithHashMail)
        } catch (error) {
            console.log(error)
            await authRepoDB.deleteUserById(newUserWithHashMail.id)
        }
        return newUser;
    },

    async authUserWithEmailService(loginOrEmail: string, password: string): Promise<TUsersDb | null> {
        const user: TUsersWithHashDb | null = await authRepoDB.findUserByLoginEmail(loginOrEmail)
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

    async confirmationCodeService(code: string): Promise<boolean> {
        const user = await authRepoDB.findUserByCode(code)
        if (!user) {
            return false
        }
        if (user.emailConfirmation.confirmationCode !== code) {
            return false
        }
        if (user.emailConfirmation.isConfirmed) {
            return false
        }
        if (user.emailConfirmation.expirationTime < new Date()) {
            return false
        }
        return await authRepoDB.changeIsConfirmed(user.id);
    },

    async resendingEmailService(email: string): Promise<boolean> {
        const previouslyRegisteredUserWithMail = await authRepoDB.findUserByEmail(email)
        if (previouslyRegisteredUserWithMail && previouslyRegisteredUserWithMail.emailConfirmation.isConfirmed) {
            return false
        }
        if (previouslyRegisteredUserWithMail && previouslyRegisteredUserWithMail.emailConfirmation.expirationTime < new Date()) {
            return false
        }
        if (previouslyRegisteredUserWithMail && !previouslyRegisteredUserWithMail.emailConfirmation.isConfirmed) {
            try {
                await emailManager.transportEmailResendingManager(email, previouslyRegisteredUserWithMail)

            } catch (error) {
                console.log(error)
                throw new Error("Something is Wrong!")
            }
        }
        return true
    }
}