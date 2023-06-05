import {PostType} from "./post_API-repositories-memory";
import {commentCollection, postCollection} from "../repositories/db";
import {SortDirection} from "mongodb";
import {TypeGetCommentsByPostId, TypeGetPostsByBlogId} from "../blog_API-repositories/blogRepositoriesQuery";
import {CommentType} from "./post_API-repositories-db";

export const postsRepoQuery = {
    async getPostsRepoQuery(sortBy: string,
                            sortDirection: SortDirection,
                            pageNumber: number,
                            pageSize: number): Promise<TypeGetPostsByBlogId> {
        const countTotal: number = await postCollection.countDocuments({})
        const skipPost: number = (+pageNumber - 1) * +pageSize
        const countPages: number = Math.ceil(countTotal / +pageSize)
        const getPostDB: PostType[] = await postCollection
            .find({}, {projection: {_id: false}})
            .sort({[sortBy]: sortDirection})
            .skip(skipPost)
            .limit(pageSize)
            .toArray()

        return {
            pagesCount: countPages,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: countTotal,
            items: getPostDB
        }
        },
    async getCommentsRepoQuery(sortBy: string,
                               sortDirection: SortDirection,
                               pageNumber: number,
                               pageSize: number): Promise<TypeGetCommentsByPostId> {
        const countTotal: number = await commentCollection.countDocuments({})
        const skipComments: number = (+pageNumber - 1) * +pageSize
        const countPages: number = Math.ceil(countTotal / +pageSize)
        const getCommentsDB: CommentType[] = await commentCollection
            .find({}, {projection: {_id: false}})
            .sort({[sortBy]: sortDirection})
            .skip(skipComments)
            .limit(pageSize)
            .toArray()

        return {
            pagesCount: countPages,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: countTotal,
            items: getCommentsDB
        }

    }
}