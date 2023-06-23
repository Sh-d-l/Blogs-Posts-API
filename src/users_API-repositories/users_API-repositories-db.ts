import {usersConfirmMailCollection, usersSuperAdminCollection} from "../repositories/db";

export type TUsersWithHashEmailDb = {
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
export type TUsersWithHashDb = {
    id: string,
    login: string,
    email: string,
    userHash: string,
    createdAt: string;
}

export const usersRepoDb = {

    async createNewUser(newUserWithHash: TUsersWithHashDb) {
        await usersSuperAdminCollection.insertOne({...newUserWithHash})
    },
    async createNewUserEmail(newUserWithHashEmail: TUsersWithHashEmailDb) {
        await usersConfirmMailCollection.insertOne({...newUserWithHashEmail})
    },
    async findUserByLoginEmail(loginOrEmail: string): Promise<TUsersWithHashDb | null> {
        return await usersSuperAdminCollection.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]}, {projection: {_id: 0}});
    },
    async findUserByEmail(email: string): Promise<TUsersWithHashEmailDb | null> {
        return await usersConfirmMailCollection.findOne({email}, {projection: {_id: 0}});
    },
    async findUserByUserId(id: string): Promise<TUsersWithHashDb | null> {
        return await usersSuperAdminCollection.findOne({id}, {projection: {_id: 0}});
    },
    async findUserByCode(code: string): Promise<TUsersWithHashEmailDb | null> {
       return await usersConfirmMailCollection.findOne({"emailConfirmation.confirmationCode": code}, {projection: {_id: 0}});
    },
    async changeIsConfirmed(id: string) {
        await usersConfirmMailCollection.updateOne({id}, {$set: {"emailConfirmation.isConfirmed":true}})
    },
    async deleteUserById(id: string): Promise<boolean> {
        const deleteResult = await usersSuperAdminCollection.deleteOne({id: id})
        if (deleteResult.deletedCount > 0) {
            return true
        } else {
            return false
        }
    }
}


