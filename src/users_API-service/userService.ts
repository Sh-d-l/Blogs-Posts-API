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
import {repoRefreshToken} from "../repositories/revokedRefreshToken";


export const createUserService = {

    async createUserWithEmailService(login: string, password: string, email: string): Promise<TUsersDb | null> {
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

    async authUserWithEmailService(loginOrEmail: string, password: string): Promise<TUsersDb | null> {
        const user: TUsersWithHashEmailDb | null = await usersRepoDb.findUserByLoginOrEmail(loginOrEmail)
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

    async refreshingTokensService(refreshToken: string): Promise<string[] | null> {
        if (!refreshToken) return null;
        const userId = await jwtService.getUserIdByToken(refreshToken)
        if (!userId) return null;
        const refreshTokenObject = {
            refreshToken:refreshToken
        }
        const checkBlackList = await repoRefreshToken.blacklistedRefreshTokenSearch(refreshTokenObject)
        //console.log(checkBlackList,"checkBlackList")
        if(checkBlackList) return null

        const newAccessToken = await jwtService.createAccessToken(userId)
        const newRefreshToken = await jwtService.createRefreshToken(userId)

        const addRefreshTokenToBlackListSuccess = await repoRefreshToken.addBlackListRefreshTokens(refreshTokenObject)
        //if(addRefreshTokenToBlackListSuccess) return null
        return [newAccessToken, newRefreshToken]
    },

    async confirmationCodeService(code: string): Promise<boolean | null> {
        const user = await usersRepoDb.findUserByCode(code)
        if (user) {
            return await usersRepoDb.changeIsConfirmed(user.id);
        } else return null
    },

    async resendingEmailService(email: string): Promise<boolean | null> {
        const previouslyRegisteredUserWithMail = await usersRepoDb.findUserByEmail(email)
        if (previouslyRegisteredUserWithMail && !previouslyRegisteredUserWithMail.emailConfirmation.isConfirmed
            && previouslyRegisteredUserWithMail.emailConfirmation.expirationTime > new Date()) {
            await usersRepoDb.changeExpirationTimeConfirmationCode(email)
        }
        const updatedUser = await usersRepoDb.findUserByEmail(email)
        if (updatedUser) {
            await emailManager.transportEmailResendingManager(email, updatedUser)
            return true
        } else return null
    },

    async logoutService(refreshToken:string):Promise<boolean> {
        if (!refreshToken) return false;
        const refreshTokenObject = {
            refreshToken:refreshToken
        }
        const checkBlackList = await repoRefreshToken.blacklistedRefreshTokenSearch(refreshTokenObject)
        if(checkBlackList) return false;
        const userId = await jwtService.getUserIdByToken(refreshToken)
        if (!userId) return false;

        const logout = await repoRefreshToken.addBlackListRefreshTokens(refreshTokenObject)
        if(logout) return true
        else return false;
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