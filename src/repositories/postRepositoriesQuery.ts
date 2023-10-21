import {PostType} from "../types/types";
import {CreateCommentByPostIDModel, CreatePostModel} from "../mongoDB/db";
import {SortDirection} from "mongodb";
import {TypeGetCommentsByPostId, TypeGetPostsByBlogId} from "../types/types";
import {CommentType} from "../types/types";

export class PostsRepoQuery {
    async getPostsRepoQuery(sortBy: string,
                            sortDirection: SortDirection,
                            pageNumber: number,
                            pageSize: number): Promise<TypeGetPostsByBlogId> {
        const totalCount: number = await CreatePostModel.countDocuments({})
        const postSkip: number = (+pageNumber - 1) * +pageSize
        const pagesCount: number = Math.ceil(totalCount / +pageSize)
        const getPostDB: PostType[] = await CreatePostModel
            .find({}, {projection: {_id: false}})
            .sort({[sortBy]: sortDirection})
            .skip(postSkip)
            .limit(pageSize)
            .lean()

        return {
            pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: getPostDB
        }
        }
    async getCommentsRepoQuery(postId:string,
                               sortBy: string,
                               sortDirection: SortDirection,
                               pageNumber: number,
                               pageSize: number): Promise<TypeGetCommentsByPostId | null> {
        const commentsTotal: number = await CreateCommentByPostIDModel.countDocuments({postId})
        const commentsSkip: number = (+pageNumber - 1) * +pageSize
        const pagesCount: number = Math.ceil(commentsTotal / +pageSize)
        const getCommentsDB: CommentType[] = await CreateCommentByPostIDModel
            .find({postId}, {projection: {_id: false, postId:false}})
            .sort({[sortBy]: sortDirection})
            .skip(commentsSkip)
            .limit(pageSize)
            .lean()
        if(getCommentsDB.length > 0) {
            return {
                pagesCount,
                page: pageNumber,
                pageSize: pageSize,
                totalCount: commentsTotal,
                items: getCommentsDB
            }
        }
        else {
            return null;
        }

    }
}

