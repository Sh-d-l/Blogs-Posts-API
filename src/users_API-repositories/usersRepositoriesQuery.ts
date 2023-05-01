import {usersCollection} from "../repositories/db";
import {SortDirection} from "mongodb";

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
    async getUsersRepoQuery(searchLoginTerm: string | null,
                            searchEmailTerm: string | null,
                            sortBy: string,
                            sortDirection: SortDirection,
                            pageNumber: number,
                            pageSize: number): Promise<TypeGetUsersWithCount> {
        const skip: number = (+pageNumber - 1) * +pageSize;
        let filterSearchLoginTerm = searchLoginTerm
            ? {login: new RegExp(searchLoginTerm, "i")}
            : {};
        let filterSearchEmailTerm = searchEmailTerm
            ? {email: new RegExp(searchEmailTerm, "i")}
            : {};
        const usersCount: number = await usersCollection.countDocuments(filterSearchLoginTerm) +
            await usersCollection.countDocuments(filterSearchEmailTerm);
        const pagesCount: number = Math.ceil(usersCount / +pageSize);
        const getUsersDbByLoginEmail: TUsersDb[] = await usersCollection
            .find({$or: [filterSearchLoginTerm, {projection: {_id:false}}, filterSearchEmailTerm, {projection: {_id:false}}]})
            .skip(skip)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection})
            .toArray()
        const resArrUsers: TypeGetUsersWithCount = {
            pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: usersCount,
            items: getUsersDbByLoginEmail,TU
        }
        return resArrUsers;
    }


}