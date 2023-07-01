import {TUsersDb} from "../types/types";
import {randomUUID} from "crypto";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from 'uuid';
import add from 'date-fns/add'
import {emailManager} from "../domain/emailManager";
import {TUsersWithHashEmailDb} from "../types/types";
import {
    usersRepoDb
} from "../users_API-repositories/users_API-repositories-db";
import {jwtService} from "../application/jwt-service";


export const createUserService = {

    async createUserWithEmailService(login: string, password: string, email: string, /*ip: string | undefined*/): Promise<TUsersDb | null> {
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
           /* registrationData: {
                userIP: ip,
                dataOfCreation: new Date(),
            },*/
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
        //numberOfUsers.push(newUserWithHashMail)
        try {
            await emailManager.transportEmailManager(email, newUserWithHashMail)
        } catch (error) {
            console.log(error)
            await usersRepoDb.deleteUserById(newUserWithHashMail.id)
        }
        // if(expirationTime < new Date() && numberOfUsers.length > 2 && newUserWithHashMail.registrationData.userIP) {
        //     return null
        // }
        return newUser;
    },

    async authUserWithEmailService(loginOrEmail: string, password: string): Promise<TUsersDb | null> {
        //console.log(loginOrEmail)
        const user: TUsersWithHashEmailDb | null = await usersRepoDb.findUserByLoginOrEmail(loginOrEmail)
        // console.log(user)
        // console.log(await usersConfirmMailCollection.find().toArray(), 'usersConfirmMailCollection')
        // console.log(await usersSuperAdminCollection.find().toArray(), 'usersSuperAdminCollection')
        if (!user) return null;
        //if(!user.emailConfirmation.isConfirmed) return null
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

    async refreshingTokensService(refreshToken:string): Promise<boolean> {
        if(!refreshToken) return false;
        const expiresInToken = await jwtService.verifyRefreshToken(refreshToken)
        console.log(expiresInToken)
    },

    async confirmationCodeService(code: string): Promise<boolean | null> {
        const user = await usersRepoDb.findUserByCode(code)
        if(user) {
            return await usersRepoDb.changeIsConfirmed(user.id);
        }
        else return  null
    },

    async resendingEmailService(email: string): Promise<boolean | null> {
        const previouslyRegisteredUserWithMail = await usersRepoDb.findUserByEmail(email)
        if (previouslyRegisteredUserWithMail && !previouslyRegisteredUserWithMail.emailConfirmation.isConfirmed
            && previouslyRegisteredUserWithMail.emailConfirmation.expirationTime > new Date()) {
            await usersRepoDb.changeExpirationTimeConfirmationCode(email)
        }
        const updatedUser = await usersRepoDb.findUserByEmail(email)
        if(updatedUser) {
            await emailManager.transportEmailResendingManager(email, updatedUser)
            return true
        }
        else return null
    },
    async findUserByIdWithMailService(userId: string): Promise<TUsersDb | null> {
        const user = await usersRepoDb.findUserByUserId(userId)
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

    /*------------------------------creating a super admin user---------------------------------------*/

    async createUserSuperAdminService(login: string, password: string, email: string): Promise<TUsersDb> {
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
            // registrationData: {
            //     userIP: ip,
            //     dataOfCreation: new Date(),
            // },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationTime: add(new Date(), {
                    hours: 0,
                    minutes: 3,
                }),
                isConfirmed: false,
            }
        }
        await usersRepoDb.createNewUser(newUserWithHash)
        return newUser;
    },
    async deleteUserById(id: string): Promise<boolean> {
        return await usersRepoDb.deleteUserById(id)
    }
}