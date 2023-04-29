import {PostType} from "./post_API-repositories-memory";
import {postCollection} from "../repositories/db";
import {SortDirection} from "mongodb";
import {TypeGetPostsByBlogId} from "../blog_API-repositories/blogRepositoriesQuery";

export const postsRepoQuery = {
    async getPostsRepoQuery(sortBy:string,
                            sortDirection:SortDirection,
                            pageNumber:number,
                            pageSize:number):Promise<TypeGetPostsByBlogId | null> {
        const countTotal:number =  await postCollection.countDocuments({})
        const skipPost:number  = (+pageNumber - 1) * +pageSize
        const countPages:number = Math.ceil(countTotal / +pageSize)
        const getPostDB:PostType[] = await postCollection
            .find({})
            .sort({[sortBy]:sortDirection})
            .skip(skipPost)
            .limit(pageSize)
            .toArray()
        if(getPostDB.length != 0) {
            const newArrPosts:TypeGetPostsByBlogId = {
                pagesCount: countPages,
                page: pageNumber,
                pageSize: pageSize,
                totalCount: countTotal,
                items: getPostDB
            }
            return newArrPosts;
        }
        else {
            return null
        }

        }
}