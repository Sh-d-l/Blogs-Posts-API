import {PostType} from "./post_API-repositories-memory";
import {postCollection} from "../repositories/db";
import {SortDirection} from "mongodb";

export type TypeGetPosts = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: [
        {
            id: string,
            title: string,
            shortDescription: string,
            content: string,
            blogId: string,
            blogName: string,
            createdAt: string,
        }
    ]
}


export const postsRepoQuery = {
    async getPostsRepoQuery(sortBy:string,
                            sortDirection:SortDirection,
                            pageNumber:number,
                            pageSize:number):Promise<TypeGetPosts[]> {
        const countTotal:number =  await postCollection.countDocuments({})
        const skipPost:number  = (+pageNumber - 1) * +pageSize
        const countPages:number = Math.ceil(countTotal / +pageSize)
        const getPostDB:PostType[] = await postCollection
            .find({})
            .sort({sortBy:sortDirection})
            .skip(skipPost)
            .limit(pageSize)
            .toArray()
        const newArrPosts:TypeGetPosts[] = getPostDB.map((post:PostType) => {
            return {
                pagesCount: countPages,
                page: pageNumber,
                pageSize: pageSize,
                totalCount: countTotal,
                items: [
                    {
                        id: post.id,
                        title: post.title,
                        shortDescription: post.shortDescription,
                        content: post.content,
                        blogId: post.blogId,
                        blogName: post.blogId,
                        createdAt: post.createdAt,
                    }
                ]
            }
        })
        console.log(newArrPosts)
        return newArrPosts;
    }
}