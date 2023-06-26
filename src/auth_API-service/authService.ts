import {TUsersDb} from "../types/types";
import {randomUUID} from "crypto";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from 'uuid';
import add from 'date-fns/add'
import {emailManager} from "../domain/emailManager";
import {authRepoDB} from "../auth_API-repositories/authRepoDB";
import {TUsersWithHashEmailDb} from "../types/types";
import {usersConfirmMailCollection, usersSuperAdminCollection} from "../repositories/db";

export const authWithMailService = {

    async createUserWithEmailService(login: string, password: string, email: string, ip: string | undefined): Promise<TUsersDb | null> {
        //const numberOfUsers = [];
        // const expirationTime = add(new Date(), {
        //         hours: 0,
        //         minutes: 3,
        //     })
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
            registrationData: {
                userIP: ip,
                dataOfCreation: new Date(),
            },
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
        //numberOfUsers.push(newUserWithHashMail)
        try {
            await emailManager.transportEmailManager(email, newUserWithHashMail)
        } catch (error) {
            console.log(error)
            await authRepoDB.deleteUserById(newUserWithHashMail.id)
        }
        // if(expirationTime < new Date() && numberOfUsers.length > 2 && newUserWithHashMail.registrationData.userIP) {
        //     return null
        // }
        return newUser;
    },

    async authUserWithEmailService(loginOrEmail: string, password: string): Promise<TUsersDb | null> {
        console.log(loginOrEmail)
        const user: TUsersWithHashEmailDb | null = await authRepoDB.findUserByLoginOrEmail(loginOrEmail)
        console.log(user)
        console.log(await usersConfirmMailCollection.find())
        console.log(await usersSuperAdminCollection.find())
        if (!user) return null;
        // if(!user.emailConfirmation.isConfirmed) return null
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

    async confirmationCodeService(code: string): Promise<boolean | null> {
        const user = await authRepoDB.findUserByCode(code)
        if(user) {
            return await authRepoDB.changeIsConfirmed(user.id);
        }
        else return  null
    },

    async resendingEmailService(email: string): Promise<boolean | null> {
        const previouslyRegisteredUserWithMail = await authRepoDB.findUserByEmail(email)
        if (previouslyRegisteredUserWithMail && !previouslyRegisteredUserWithMail.emailConfirmation.isConfirmed
            && previouslyRegisteredUserWithMail.emailConfirmation.expirationTime > new Date()) {
            await authRepoDB.changeExpirationTimeConfirmationCode(email)
        }
        const updatedUser = await authRepoDB.findUserByEmail(email)
        if(updatedUser) {
            await emailManager.transportEmailResendingManager(email, updatedUser)
            return true
        }
        else return null
    },
    async findUserByIdWithMailService(userId: string): Promise<TUsersDb | null> {
        const user = await authRepoDB.findUserByUserId(userId)
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
}