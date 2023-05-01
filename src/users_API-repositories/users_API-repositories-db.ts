import {UUID} from "crypto";
import {usersCollection} from "../repositories/db";
import {TUsersDb} from "./usersRepositoriesQuery";

export const usersRepoDb = {
    async createNewUser (newUser:TUsersDb) {
        return await usersCollection.insertOne({...newUser})
    },
    async deleteUserById(id):Promise<boolean> {
        const deleteResult = await usersCollection.deleteOne({id})
        return deleteResult.deletedCount > 0;
}
 }


