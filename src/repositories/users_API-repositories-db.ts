import {TUsersWithHashEmailDb} from "../types/types";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {CreateUserWithMailModel} from "../mongoDB/db";

export const usersRepoDb = {

/*------------------------create user super admin------------------------------*/

    async createNewUser(newUserWithHash: TUsersWithHashEmailDb) {
        await CreateUserWithMailModel.create({...newUserWithHash})
    },

/*----------------------------create user with email----------------------------*/

    async createNewUserEmail(newUserWithHashEmail: TUsersWithHashEmailDb) {
        await CreateUserWithMailModel.create({...newUserWithHashEmail})
    },
    async findUserByEmail(email: string): Promise<TUsersWithHashEmailDb | null> {
        return CreateUserWithMailModel.findOne({email}, {projection: {_id: 0}});
    },
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<TUsersWithHashEmailDb | null> {
        return CreateUserWithMailModel.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]}, {projection: {_id: 0}});
    },
    async findUserByCode(code: string): Promise<TUsersWithHashEmailDb | null> {
        return CreateUserWithMailModel.findOne({"emailConfirmation.confirmationCode": code}, {projection: {_id: 0}});
    },
    async changeIsConfirmed(code:string):Promise<boolean> {
        const isConfirmed =  await CreateUserWithMailModel.updateOne({"emailConfirmation.confirmationCode":code}, {"emailConfirmation.isConfirmed": true})
        return !!isConfirmed;
    },
    async changeExpirationTimeConfirmationCode(email:string):Promise<boolean> {
        const updateSuccess = await  CreateUserWithMailModel.updateOne({email}, {"emailConfirmation.confirmationCode":uuidv4(), "emailConfirmation.expirationTime":add(new Date(), {
                    hours: 0,
                    minutes: 3,
                }),})
        return !!updateSuccess
    },
    async findUserByUserId(userId: string): Promise<TUsersWithHashEmailDb | null> {
        return CreateUserWithMailModel.findOne({id:userId});
    },
    async deleteUserById(id: string): Promise<boolean> {
        const deleteResult = await CreateUserWithMailModel.deleteOne({id})
        return !!deleteResult;
    },

}


