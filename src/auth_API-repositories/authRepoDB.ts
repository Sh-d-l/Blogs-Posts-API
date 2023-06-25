import {TUsersWithHashEmailDb} from "../types/types";
import {usersConfirmMailCollection, usersSuperAdminCollection} from "../repositories/db";
import {uuid} from "uuidv4";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {UpdateResult} from "mongodb";

export const authRepoDB = {

    async createNewUserEmail(newUserWithHashEmail: TUsersWithHashEmailDb) {
        await usersConfirmMailCollection.insertOne({...newUserWithHashEmail})
    },
    async findUserByEmail(email: string): Promise<TUsersWithHashEmailDb | null> {
        return await usersConfirmMailCollection.findOne({email}, {projection: {_id: 0}});
    },
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<TUsersWithHashEmailDb | null> {
        return await usersConfirmMailCollection.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]}, {projection: {_id: 0}});
    },
    async findUserByCode(code: string): Promise<TUsersWithHashEmailDb | null> {
        return await usersConfirmMailCollection.findOne({"emailConfirmation.confirmationCode": code}, {projection: {_id: 0}});
    },
    async changeIsConfirmed(id: string):Promise<boolean> {
        const isConfirmed =  await usersConfirmMailCollection.updateOne({id}, {$set: {"emailConfirmation.isConfirmed":true}})
        return !!isConfirmed.matchedCount;
    },
    async changeExpirationTimeConfirmationCode(email:string):Promise<boolean> {
         const updateSuccess = await  usersConfirmMailCollection.updateOne({email}, {$set:{"emailConfirmation.confirmationCode":uuidv4(), "emailConfirmation.expirationTime":add(new Date(), {
                    hours: 0,
                    minutes: 3,
                }),}})
        return !!updateSuccess.matchedCount
    },
    async findUserByUserId(id: string): Promise<TUsersWithHashEmailDb | null> {
        return await usersConfirmMailCollection.findOne({id}, {projection: {_id: 0}});
    },
    async deleteUserById(id: string): Promise<boolean> {
        const deleteResult = await usersConfirmMailCollection.deleteOne({id: id})
        return deleteResult.deletedCount > 0;
    },
}