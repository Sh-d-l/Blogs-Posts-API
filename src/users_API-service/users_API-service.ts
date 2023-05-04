import {TUsersDb} from "../users_API-repositories/usersRepositoriesQuery";
import {randomUUID} from "crypto";
import {usersRepoDb} from "../users_API-repositories/users_API-repositories-db";
import {TUsersWithHashDb} from "../users_API-repositories/users_API-repositories-db";
import bcrypt from "bcrypt";

export const usersService = {
    async _generateHash (password:string) {
        const salt = 10
        return await bcrypt.hash(password,salt)
    },

    async authUserService (loginOrEmail:string, password:string):Promise<boolean> {
        const user:TUsersWithHashDb | null = await usersRepoDb.findUserByLoginEmail(loginOrEmail)
        const checkUserHash:string = await  this._generateHash(password)
        if(user == null ) return  false;
        if(user.userHash !== checkUserHash) {
            return false
        }
        else {
            return true
        }
    },

    async createUserService (login:string, password:string, email:string): Promise<TUsersDb> {
        const userHash = await this._generateHash(password)
        const newUser:TUsersDb = {
            id: randomUUID(),
            login,
            email,
            createdAt: new Date().toISOString(),
        }
        const newUserWithHash:TUsersWithHashDb = {
            id: randomUUID(),
            login,
            email,
            userHash,
            createdAt: new Date().toISOString(),
        }
        await usersRepoDb.createNewUser(newUserWithHash)
    return newUser;
},

    async deleteUserById (id:string):Promise<boolean> {
        return await usersRepoDb.deleteUserById(id)
    }
}