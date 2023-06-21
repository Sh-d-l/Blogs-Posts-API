import {usersCollection} from "../repositories/db";

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
        await usersCollection.insertOne({...newUserWithHash})
    },
    async findUserByLoginEmail(loginOrEmail: string): Promise<TUsersWithHashDb | null> {
        return await usersCollection.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]}, {projection: {_id: 0}});
    },
    async findUserByUserId(id: string): Promise<TUsersWithHashDb | null> {
        return await usersCollection.findOne({id}, {projection: {_id: 0}});
    },
    // async findUserByCode(code: string): Promise<TUsersWithHashEmailDb | null> {
    //    return await usersCollection.findOne({"emailConfirmation.confirmationCode": code}, {projection: {_id: 0}});
    //
    // },
    async deleteUserById(id: string): Promise<boolean> {
        const deleteResult = await usersCollection.deleteOne({id: id})
        if (deleteResult.deletedCount > 0) {
            return true
        } else {
            return false
        }
    }
}


