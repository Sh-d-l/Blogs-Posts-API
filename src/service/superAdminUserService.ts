import {CreateObjectOfUserForClient, CreateUsersWithConfirmationCode} from "../types/types";
import bcrypt from "bcrypt";
import {randomUUID} from "crypto";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {UsersRepoDb} from "../repositories/users_API-repositories-db";
import "reflect-metadata";
import {injectable} from "inversify";

@injectable()
export class SuperAdminUserService {
    constructor(protected usersRepo:UsersRepoDb) {
    }
    async createUserSuperAdminService(login: string, password: string, email: string): Promise<CreateObjectOfUserForClient> {
        const userHash = await bcrypt.hash(password, 10)
        const newUser = new CreateObjectOfUserForClient(
            randomUUID(),
            login,
            email,
            new Date().toISOString(),
        )

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

        await this.usersRepo.createNewUser(newUserWithHashMail)
        return newUser;
    }
    async deleteUserById(id: string): Promise<boolean> {
        return await this.usersRepo.deleteUserById(id)
    }
}
