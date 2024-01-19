import {
    CreateObjectOfUserForClient,
    CreateUsersWithConfirmationCode, TypeRecoveryCode, TypeRefreshTokenMeta,
} from "../types/types";
import {randomUUID} from "crypto";
import bcrypt from "bcrypt";
import {v4, v4 as uuidv4} from 'uuid';
import add from 'date-fns/add'
import {emailManager} from "../domain/emailManager";
import {UsersRepoDb} from "../repositories/users_API-repositories-db";
import {jwtService} from "../application/jwt-service";
import {SecurityDevicesRepo} from "../repositories/securityDevicesRepo";
import "reflect-metadata";
import {injectable} from "inversify";
@injectable()

export class CreateUserService {
    constructor( protected usersRepo:UsersRepoDb,
    protected securityDevicesRepo:SecurityDevicesRepo) {
    }
    async createUserWithEmailService(login: string,
                                     password: string,
                                     email: string): Promise<CreateObjectOfUserForClient | null> {
        const userHash = await bcrypt.hash(password, 10)
        const newUser = new CreateObjectOfUserForClient(randomUUID(), login, email, new Date().toISOString())

        const newUserWithHashMail = new CreateUsersWithConfirmationCode(
            newUser.id,
            newUser.login,
            newUser.email,
            newUser.createdAt,
            userHash,
            {
                    confirmationCode: uuidv4(),
                    expirationTime: add(new Date(), {
                        hours: 0,
                        minutes: 3,
                    }),
                    isConfirmed: false,
                }
        )
        await this.usersRepo.createNewUserEmail(newUserWithHashMail)
        try {
            await emailManager.transportEmailManager(email, newUserWithHashMail)
        } catch (error) {
            console.log(error)
            await this.usersRepo.deleteUserById(newUserWithHashMail.id)
        }
        return newUser;
    }

    async authUserWithEmailService(loginOrEmail: string,
                                   password: string,
                                   ip: string,
                                   title: string | undefined): Promise<(string)[] | null> {
        const deviceId = v4()
        const user: CreateUsersWithConfirmationCode | null = await this.usersRepo.findUserByLoginOrEmail(loginOrEmail)
        if (!user) return null;
        //if (!user.emailConfirmation.isConfirmed) return null
        const checkUserHash: boolean = await bcrypt.compare(password, user.userHash)
        if (checkUserHash) {
            const refreshTokenMeta = new TypeRefreshTokenMeta(
                user.id,
                deviceId,
                ip,
                new Date(),
                title,
            )
            // const refreshTokenMeta = {
            //     userId: user.id,
            //     deviceId,
            //     ip,
            //     lastActiveDate: new Date(),
            //     title,
            // }

            const accessToken = await jwtService.createAccessToken(deviceId, user.id)
            const refreshToken = await jwtService.createRefreshToken(deviceId,
                refreshTokenMeta.lastActiveDate,
                refreshTokenMeta.userId)
            await this.securityDevicesRepo.addRefreshTokenMeta(refreshTokenMeta)
            return [accessToken, refreshToken]
        } else {
            return null;
        }
    }

    async passwordRecoveryService(email: string): Promise<boolean | null> {
        const user = await this.usersRepo.findUserByEmail(email)
        if (user) {
            const documentWithRecoveryCode = new TypeRecoveryCode(
                user.id,
                uuidv4(),
                add(new Date(), {
                            hours: 0,
                            minutes: 3,
                        })
            )
            // documentWithRecoveryCode = {
            //     userId: user.id,
            //     recoveryCode: uuidv4(),
            //     expirationTime: add(new Date(), {
            //         hours: 0,
            //         minutes: 3,
            //     })
            // }
            try {
                await emailManager.transportEmailManagerPasswordRecovery(email, documentWithRecoveryCode)
                await this.usersRepo.createDocumentWithRecoveryCode(documentWithRecoveryCode)
                return true
            } catch (error) {
                console.log(error, "Email not sent")
                await this.usersRepo.deleteDocumentWithRecoveryCode(documentWithRecoveryCode.recoveryCode)
                return null
            }

        } else return true

    }

    async changePasswordOfUser(newPassword: string, recoveryCode: string): Promise<boolean> {
        const recoveryCodeObject = await this.usersRepo.findRecoveryCodeObjectByRecoveryCode(recoveryCode)
         if (!recoveryCodeObject) return false
        if (recoveryCodeObject.expirationTime > new Date()) {
            const newHash = await bcrypt.hash(newPassword, 10)
            await this.usersRepo.updatePasswordInTheUserObject(recoveryCodeObject.userId, newHash)
            await this.usersRepo.deleteDocumentWithRecoveryCode(recoveryCode)
            return true
        } else return false

    }

    async refreshingTokensService(refreshToken: string): Promise<string[] | null> {
        if (!refreshToken) return null;
        const payloadArray = await jwtService.getPayloadRefreshToken(refreshToken)
        if (!payloadArray) return null;

        const refreshTokenMetaObject = await this.securityDevicesRepo.findRefreshTokenMetaByDeviceId(payloadArray[0])
        if (!refreshTokenMetaObject) return null;

        if (new Date(payloadArray[1]).getTime() == new Date(refreshTokenMetaObject.lastActiveDate).getTime()) {
            await this.securityDevicesRepo.updateDateRefreshToken(payloadArray[0])
            const refreshTokenWithUpdateLastActiveDate = await this.securityDevicesRepo.findRefreshTokenMetaByDeviceId(payloadArray[0])
            if (refreshTokenWithUpdateLastActiveDate !== null) {
                const newAccessToken = await jwtService.createAccessToken(payloadArray[0], payloadArray[2])
                const newRefreshToken = await jwtService.createRefreshToken(payloadArray[0],
                    refreshTokenWithUpdateLastActiveDate.lastActiveDate,
                    payloadArray[2])
                return [newAccessToken, newRefreshToken]
            } else return null
        } else return null
    }

    async confirmationCodeService(code: string): Promise<boolean | null> {
        return await this.usersRepo.changeIsConfirmed(code);
    }

    async resendingEmailService(email: string): Promise<boolean | null> {
        const previouslyRegisteredUserWithMail = await this.usersRepo.findUserByEmail(email)

        if (previouslyRegisteredUserWithMail && !previouslyRegisteredUserWithMail.emailConfirmation.isConfirmed
            && previouslyRegisteredUserWithMail.emailConfirmation.expirationTime > new Date()) {
            await this.usersRepo.changeExpirationTimeConfirmationCode(email)
        }
        const updatedUser = await this.usersRepo.findUserByEmail(email)

        if (updatedUser) {
            await emailManager.transportEmailManager(email, updatedUser)
            return true
        } else return null
    }

    async logoutService(refreshToken: string): Promise<boolean> {
        if (!refreshToken) return false;
        const payloadRefreshToken = await jwtService.getPayloadRefreshToken(refreshToken)
        if (!payloadRefreshToken) return false;
        return await this.securityDevicesRepo.deleteDeviceByDeviceId(payloadRefreshToken[0]);
    }

    async findUserByIdWithMailService(userId: string): Promise<CreateObjectOfUserForClient | null> {
        const user = await this.usersRepo.findUserByUserId(userId)
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
    }

}
