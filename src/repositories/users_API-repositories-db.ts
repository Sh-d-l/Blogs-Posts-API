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
    async changeIsConfirmed(id: string):Promise<boolean> {
        console.log(id, "user.id")
        const isConfirmed =  await CreateUserWithMailModel.findByIdAndUpdate({id}, {"emailConfirmation.isConfirmed": true})
        console.log(isConfirmed)
        return !!isConfirmed;
    },
    async changeExpirationTimeConfirmationCode(email:string):Promise<boolean> {
        const updateSuccess = await  CreateUserWithMailModel.updateOne({email}, {$set:{"emailConfirmation.confirmationCode":uuidv4(), "emailConfirmation.expirationTime":add(new Date(), {
                    hours: 0,
                    minutes: 3,
                }),}})
        return !!updateSuccess
    },
    async findUserByUserId(id: string): Promise<TUsersWithHashEmailDb | null> {
        return CreateUserWithMailModel.findById({id}, {projection: {_id: 0}});
    },
    async deleteUserById(id: string): Promise<boolean> {
        const deleteResult = await CreateUserWithMailModel.findByIdAndDelete({id: id})
        return !!deleteResult;
    },

}


