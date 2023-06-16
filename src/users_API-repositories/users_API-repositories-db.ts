import {usersCollection} from "../repositories/db";
import {uuid} from "uuidv4";

export type TUsersWithHashDb = {
    id: string,
    login: string,
    email: string,
    userHash: string,
    createdAt: string;
    emailConfirmation: {
        confirmationCode: string,
        expirationTime: Date,
        isConfirmed: boolean,
    }
}

export const usersRepoDb = {

    async createNewUser(newUserWithHash: TUsersWithHashDb) {
        await usersCollection.insertOne({...newUserWithHash})
    },
    async findUserByLoginEmail(loginOrEmail: string): Promise<TUsersWithHashDb | null> {
        return await usersCollection.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]}, {projection: {_id: 0}});
    },
    async findUserByUserId(id: string): Promise<TUsersWithHashDb | null> {
        const userDB = await usersCollection.findOne({id}, {projection: {_id: 0}});
        return userDB;
    },
    async deleteUserById(id: string): Promise<boolean> {
        const deleteResult = await usersCollection.deleteOne({id: id})
        if (deleteResult.deletedCount > 0) {
            return true
        } else {
            return false
        }
    }
}


