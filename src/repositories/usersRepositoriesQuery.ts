import {IPagination} from "../types/types";
import {CreateObjectOfUserForClient, TypeGetUsersWithCount} from "../types/types";
import {CreateUserWithMailModel} from "../mongoDB/db";
//import {usersCollection} from "../mongoDB/db";

export class UsersQueryRepo {
    async getUsersRepoQuery(pagination: IPagination): Promise<TypeGetUsersWithCount> {
        const filter = {
            $or: [{
                login: {
                    $regex: pagination.searchLoginTerm,
                    $options: "i"
                }
            }, {email: {$regex: pagination.searchEmailTerm, $options: "i"}}]
        }
        const usersCount: number = await CreateUserWithMailModel.countDocuments(filter)
        const pagesCount: number = Math.ceil(usersCount / pagination.pageSize);
        const getUsersDbByLoginEmail: CreateObjectOfUserForClient[] = await CreateUserWithMailModel
            .find(filter, {projection: {_id: false, userHash: false}})
            .sort({[pagination.sortBy]: pagination.sortDirection})
            //.sort({field:pagination.sortDirection})    /*pagination.sortBy, pagination.sortDirection*/)
            .skip(pagination.skip)
            .limit(pagination.pageSize)
            .lean()
            //.toArray()
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
