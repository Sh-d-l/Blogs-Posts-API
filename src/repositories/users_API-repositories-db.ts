import {usersCollection} from "./db";
import {TUsersWithHashEmailDb} from "../types/types";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";

export const usersRepoDb = {

/*------------------------create user super admin------------------------------*/

    async createNewUser(newUserWithHash: TUsersWithHashEmailDb) {
        await usersCollection.insertOne({...newUserWithHash})
    },

/*----------------------------create user with email----------------------------*/

    async createNewUserEmail(newUserWithHashEmail: TUsersWithHashEmailDb) {
        await usersCollection.insertOne({...newUserWithHashEmail})
    },
    async findUserByEmail(email: string): Promise<TUsersWithHashEmailDb | null> {
        return await usersCollection.findOne({email}, {projection: {_id: 0}});
    },
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<TUsersWithHashEmailDb | null> {
        return await usersCollection.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]}, {projection: {_id: 0}});
    },
    async findUserByCode(code: string): Promise<TUsersWithHashEmailDb | null> {
        return await usersCollection.findOne({"emailConfirmation.confirmationCode": code}, {projection: {_id: 0}});
    },
    async changeIsConfirmed(id: string):Promise<boolean> {
        const isConfirmed =  await usersCollection.updateOne({id}, {$set: {"emailConfirmation.isConfirmed":true}})
        return !!isConfirmed.matchedCount;
    },
    async changeExpirationTimeConfirmationCode(email:string):Promise<boolean> {
        const updateSuccess = await  usersCollection.updateOne({email}, {$set:{"emailConfirmation.confirmationCode":uuidv4(), "emailConfirmation.expirationTime":add(new Date(), {
                    hours: 0,
                    minutes: 3,
                }),}})
        return !!updateSuccess.matchedCount
    },
    async findUserByUserId(id: string): Promise<TUsersWithHashEmailDb | null> {
        return await usersCollection.findOne({id}, {projection: {_id: 0}});
    },
    async deleteUserById(id: string): Promise<boolean> {
        const deleteResult = await usersCollection.deleteOne({id: id})
        return deleteResult.deletedCount > 0;
    },

}


