import {usersSuperAdminCollection} from "../repositories/db";
import {IPagination} from "../users_API-router/users_API-router";
import {TUsersDb, TypeGetUsersWithCount} from "../types/types";

export const usersQueryRepo = {
    async getUsersRepoQuery(pagination: IPagination): Promise<TypeGetUsersWithCount> {
        const filter = {
            $or: [{
                login: {
                    $regex: pagination.searchLoginTerm,
                    $options: "i"
                }
            }, {email: {$regex: pagination.searchEmailTerm, $options: "i"}}]
        }
        const usersCount: number = await usersSuperAdminCollection.countDocuments(filter)
        const pagesCount: number = Math.ceil(usersCount / pagination.pageSize);
        const getUsersDbByLoginEmail: TUsersDb[] = await usersSuperAdminCollection
            .find(filter, {projection: {_id: false, userHash: false}})
            .sort(pagination.sortBy, pagination.sortDirection)
            .skip(pagination.skip)
            .limit(pagination.pageSize)
            .toArray()
        const resArrUsers: TypeGetUsersWithCount = {
            pagesCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount: usersCount,
            items: getUsersDbByLoginEmail,
        }
        return resArrUsers;
    }


}