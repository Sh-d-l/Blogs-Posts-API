import {usersCollection} from "../repositories/db";

export type TUsersWithHashDb = {
    id: string,
    login: string,
    email: string,
    userHash:string,
    createdAt: string;
}

export const usersRepoDb = {

    async createNewUser (newUserWithHash:TUsersWithHashDb) {
       await usersCollection.insertOne({...newUserWithHash})
    },
    async findUserByLoginEmail (loginOrEmail:string):Promise<TUsersWithHashDb | null>  {
        return await usersCollection.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]}, {projection: {_id: 0}});
    },
    async findUserByUserId (userId:string):Promise<TUsersWithHashDb | null>  {
        return await usersCollection.findOne({id: userId});
    },
    async deleteUserById(id:string):Promise<boolean> {
        const deleteResult = await usersCollection.deleteOne({id:id})
        if(deleteResult.deletedCount > 0) {
            return true
        }
        else {
            return false
        }
}
 }


