import {TUsersDb, TUsersWithHashEmailDb,} from "../types/types";
import {randomUUID} from "crypto";
import bcrypt from "bcrypt";
import {v4, v4 as uuidv4} from 'uuid';
import add from 'date-fns/add'
import {emailManager} from "../domain/emailManager";
import {usersRepoDb} from "../repositories/users_API-repositories-db";
import {jwtService} from "../application/jwt-service";
import {securityDevicesRepo} from "../repositories/securityDevicesRepo"

export const createUserService = {

    async createUserWithEmailService(login: string,
                                     password: string,
                                     email: string): Promise<TUsersDb | null> {
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

    async authUserWithEmailService(loginOrEmail: string,
                                   password: string,
                                   ip: string,
                                   title: string | undefined): Promise<(string)[] | null> {
        const deviceId = v4()
        const user: TUsersWithHashEmailDb | null = await usersRepoDb.findUserByLoginOrEmail(loginOrEmail)
        if (!user) return null;
        if (!user.emailConfirmation.isConfirmed) return null
        const checkUserHash: boolean = await bcrypt.compare(password, user.userHash)
        if (checkUserHash) {
            const refreshTokenMeta = {
                userId: user.id,
                deviceId,
                ip,
                lastActiveDate: new Date(),
                title,
            }

            const accessToken = await jwtService.createAccessToken(deviceId, user.id)
            const refreshToken = await jwtService.createRefreshToken(deviceId,
                refreshTokenMeta.lastActiveDate,
                refreshTokenMeta.userId)
            await securityDevicesRepo.addRefreshTokenMeta(refreshTokenMeta)
            return [accessToken, refreshToken]
        } else {
            return null;
        }
    },

    async passwordRecoveryService(email: string): Promise<boolean | null> {
        const user = await usersRepoDb.findUserByEmail(email)
        let documentWithRecoveryCode;
        if (user) {
            documentWithRecoveryCode = {
                userId: user.id,
                recoveryCode: uuidv4(),
                expirationTime: add(new Date(), {
                    hours: 0,
                    minutes: 3,
                })
            }
            try {
                await emailManager.transportEmailManagerPasswordRecovery(email, documentWithRecoveryCode)
                await usersRepoDb.createDocumentWithRecoveryCode(documentWithRecoveryCode)
                return true
            } catch (error) {
                console.log(error, "Email not sent")
                await usersRepoDb.deleteDocumentWithRecoveryCode(documentWithRecoveryCode.recoveryCode)
                return null
            }

        } else return true

    },

    async changePasswordOfUser(newPassword: string, recoveryCode: string): Promise<boolean> {
        const recoveryCodeObject = await usersRepoDb.findRecoveryCodeObjectByRecoveryCode(recoveryCode)
        if (recoveryCodeObject && recoveryCodeObject.expirationTime > new Date()) {
            const newHash = await bcrypt.hash(newPassword, 10)
            await usersRepoDb.updatePasswordInTheUserObject(recoveryCodeObject.userId, newHash)
            await usersRepoDb.deleteDocumentWithRecoveryCode(recoveryCode)
            return true
        } else return false

    },

    async refreshingTokensService(refreshToken: string): Promise<string[] | null> {
        if (!refreshToken) return null;
        const payloadArray = await jwtService.getPayloadRefreshToken(refreshToken)
        if (!payloadArray) return null;

        const refreshTokenMetaObject = await securityDevicesRepo.findRefreshTokenMetaByDeviceId(payloadArray[0])
        if (!refreshTokenMetaObject) return null;

        if (new Date(payloadArray[1]).getTime() == new Date(refreshTokenMetaObject.lastActiveDate).getTime()) {
            await securityDevicesRepo.updateDateRefreshToken(payloadArray[0])
            const refreshTokenWithUpdateLastActiveDate = await securityDevicesRepo.findRefreshTokenMetaByDeviceId(payloadArray[0])
            if (refreshTokenWithUpdateLastActiveDate !== null) {
                const newAccessToken = await jwtService.createAccessToken(payloadArray[0], payloadArray[2])
                const newRefreshToken = await jwtService.createRefreshToken(payloadArray[0],
                    refreshTokenWithUpdateLastActiveDate.lastActiveDate,
                    payloadArray[2])
                return [newAccessToken, newRefreshToken]
            } else return null
        } else return null
    },

    async confirmationCodeService(code: string): Promise<boolean | null> {
        return await usersRepoDb.changeIsConfirmed(code);
    },

    async resendingEmailService(email: string): Promise<boolean | null> {
        const previouslyRegisteredUserWithMail = await usersRepoDb.findUserByEmail(email)

        if (previouslyRegisteredUserWithMail && !previouslyRegisteredUserWithMail.emailConfirmation.isConfirmed
            && previouslyRegisteredUserWithMail.emailConfirmation.expirationTime > new Date()) {
            await usersRepoDb.changeExpirationTimeConfirmationCode(email)
        }
        const updatedUser = await usersRepoDb.findUserByEmail(email)

        if (updatedUser) {
            await emailManager.transportEmailManager(email, updatedUser)
            return true
        } else return null
    },

    async logoutService(refreshToken: string): Promise<boolean> {
        if (!refreshToken) return false;
        const payloadRefreshToken = await jwtService.getPayloadRefreshToken(refreshToken)
        if (!payloadRefreshToken) return false;
        return await securityDevicesRepo.deleteDeviceByDeviceId(payloadRefreshToken[0]);
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

    /*---------------------------------creating a super admin user---------------------------------------*/

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
    },


}