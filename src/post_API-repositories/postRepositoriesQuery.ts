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
        const totalCount: number = await postCollection.countDocuments({})
        const postSkip: number = (+pageNumber - 1) * +pageSize
        const pagesCount: number = Math.ceil(totalCount / +pageSize)
        const getPostDB: PostType[] = await postCollection
            .find({}, {projection: {_id: false}})
            .sort({[sortBy]: sortDirection})
            .skip(postSkip)
            .limit(pageSize)
            .toArray()

        return {
            pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: getPostDB
        }
        },
    async getCommentsRepoQuery(sortBy: string,
                               sortDirection: SortDirection,
                               pageNumber: number,
                               pageSize: number): Promise<TypeGetCommentsByPostId> {
        const commentsTotal: number = await commentCollection.countDocuments({})
        const commentsSkip: number = (+pageNumber - 1) * +pageSize
        const pagesCount: number = Math.ceil(commentsTotal / +pageSize)
        const getCommentsDB: CommentType[] = await commentCollection
            .find({}, {projection: {_id: false}})
            .sort({[sortBy]: sortDirection})
            .skip(commentsSkip)
            .limit(pageSize)
            .toArray()

        return {
            pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: commentsTotal,
            items: getCommentsDB
        }

    }
}