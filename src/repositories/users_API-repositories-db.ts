import {CreateUsersWithConfirmationCode, TypeRecoveryCode} from "../types/types";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {
    CreateDocumentWithRecoveryCodeModel,
    CreateUserWithMailModel
} from "../mongoDB/db";
import "reflect-metadata";
import {injectable} from "inversify";
@injectable()
export class UsersRepoDb  {

/*------------------------create user super admin------------------------------*/

    async createNewUser(newUserWithHash: CreateUsersWithConfirmationCode) {
        await CreateUserWithMailModel.create({...newUserWithHash})
    }

/*----------------------------create user with email----------------------------*/

    async createNewUserEmail(newUserWithHashEmail: CreateUsersWithConfirmationCode) {
        await CreateUserWithMailModel.create({...newUserWithHashEmail})
    }
    async findUserByEmail(email: string): Promise<CreateUsersWithConfirmationCode | null> {
        return CreateUserWithMailModel.findOne({email}, {_id: 0});
    }
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<CreateUsersWithConfirmationCode | null> {
        return CreateUserWithMailModel.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]}, {projection: {_id: 0}});
    }
    async findUserByCode(code: string): Promise<CreateUsersWithConfirmationCode | null> {
        return CreateUserWithMailModel.findOne({"emailConfirmation.confirmationCode": code}, {_id: 0});
    }
    async createDocumentWithRecoveryCode(recoveryCode:TypeRecoveryCode) {
        return CreateDocumentWithRecoveryCodeModel.create({...recoveryCode})
    }
    async deleteDocumentWithRecoveryCode(recoveryCode: string) {
        return CreateDocumentWithRecoveryCodeModel.deleteOne({recoveryCode})
    }
    async findRecoveryCodeObjectByRecoveryCode(recoveryCode: string):Promise<TypeRecoveryCode | null> {
        return CreateDocumentWithRecoveryCodeModel.findOne({recoveryCode})
    }
    async updatePasswordInTheUserObject(userId:string,hash:string) {
        return CreateUserWithMailModel.updateOne({id:userId},{userHash:hash})
    }
    async changeIsConfirmed(code:string):Promise<boolean> {
        const isConfirmed =  await CreateUserWithMailModel.updateOne({"emailConfirmation.confirmationCode":code}, {"emailConfirmation.isConfirmed": true})
        return !!isConfirmed;
    }
    async changeExpirationTimeConfirmationCode(email:string):Promise<boolean> {
        const updateSuccess = await  CreateUserWithMailModel.updateOne({email}, {"emailConfirmation.confirmationCode":uuidv4(), "emailConfirmation.expirationTime":add(new Date(), {
                    hours: 0,
                    minutes: 3,
                }),})
        return !!updateSuccess
    }
    async findUserByUserId(userId: string | null): Promise<CreateUsersWithConfirmationCode | null> {
        return CreateUserWithMailModel.findOne({id:userId});
    }
    async deleteUserById(id: string): Promise<boolean> {
        const deleteResult = await CreateUserWithMailModel.deleteOne({id})
        return !!deleteResult;
    }
}
//export const usersRepoDb = new UsersRepoDb()


