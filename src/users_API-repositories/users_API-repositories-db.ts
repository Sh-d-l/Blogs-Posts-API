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
        return usersCollection.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]}, {projection:{_id:false}});

    },
    async deleteUserById(id:string):Promise<boolean> {
        const deleteResult = await usersCollection.deleteOne({id})
        return deleteResult.deletedCount > 0;
}
 }


