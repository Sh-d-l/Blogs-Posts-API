import {usersSuperAdminCollection} from "../repositories/db";
import {TUsersWithHashDb } from "../types/types";

export const usersRepoDb = {

    async createNewUser(newUserWithHash: TUsersWithHashDb) {
        await usersSuperAdminCollection.insertOne({...newUserWithHash})
    },
    async deleteUserById(id: string): Promise<boolean> {
        const deleteResult = await usersSuperAdminCollection.deleteOne({id: id})
        return deleteResult.deletedCount > 0;
    },
}


