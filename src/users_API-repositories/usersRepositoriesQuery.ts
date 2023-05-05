import {usersCollection} from "../repositories/db";
import {IPagination} from "../users_API-router/users_API-router";

export type TUsersDb = {
    id: string,
    login: string,
    email: string,
    createdAt: string;
}

export type TypeGetUsersWithCount = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: TUsersDb[]
}

export const usersQueryRepo = {
    async getUsersRepoQuery(pagination: IPagination): Promise<TypeGetUsersWithCount> {
        // let filterSearchLoginTerm = searchLoginTerm
        //     ? {login: {$regex: searchLoginTerm, $options: "i"}}
        //     : {};
        // let filterSearchEmailTerm = searchEmailTerm
        //     ? {email: {$regex:searchEmailTerm, $options: "i"}}
        //     : {};
        //console.log(filterSearchLoginTerm)
        //console.log(filterSearchEmailTerm)
        const filter = {
            $and: [{
                login: {
                    $regex: pagination.searchLoginTerm,
                    $options: "i"
                }
            }, {email: {$regex: pagination.searchEmailTerm, $options: "i"}}]
        }
        const usersCount: number = await usersCollection.countDocuments(filter)
        const pagesCount: number = Math.ceil(usersCount / pagination.pageSize);
        const getUsersDbByLoginEmail: TUsersDb[] = await usersCollection
            .find(filter, {projection: {_id: false, userHash: false}})
            .sort(pagination.sortBy, pagination.sortDirection)
            .skip(pagination.skip)
            .limit(pagination.pageSize)
            .toArray()
        //console.log(getUsersDbByLoginEmail)
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