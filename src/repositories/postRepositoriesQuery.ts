import {PostType} from "../types/types";
import {CreateCommentByPostIDModel, CreatePostModel} from "../mongoDB/db";
import {SortDirection} from "mongodb";
import {TypeGetCommentsByPostId, TypeGetPostsByBlogId} from "../types/types";
import {CommentType} from "../types/types";
import {jwtService} from "../application/jwt-service";
import {likeStatusRepo} from "../composition-root";


export class PostsRepoQuery {
    async getPostsRepoQuery(sortBy: string,
                            sortDirection: SortDirection,
                            pageNumber: number,
                            pageSize: number): Promise<TypeGetPostsByBlogId> {
        const totalCount: number = await CreatePostModel.countDocuments({})
        const postSkip: number = (+pageNumber - 1) * +pageSize
        const pagesCount: number = Math.ceil(totalCount / +pageSize)
        const getPostDB: PostType[] = await CreatePostModel
            .find({}, {_id: false,__v:0})
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
                               accessToken:string | undefined,
                               sortBy: string,
                               sortDirection: SortDirection,
                               pageNumber: number,
                               pageSize: number): Promise<TypeGetCommentsByPostId | null> {
        const commentsTotal: number = await CreateCommentByPostIDModel.countDocuments({postId})
        const commentsSkip: number = (+pageNumber - 1) * +pageSize
        const pagesCount: number = Math.ceil(commentsTotal / +pageSize)

        const getCommentsDB: CommentType[] = await CreateCommentByPostIDModel
            .find({postId}, {_id: 0, postId:0, __v:0})
            .sort({[sortBy]: sortDirection})
            .skip(commentsSkip)
            .limit(pageSize)
            .lean()

        let userId: string | null = null;

        if (accessToken) {
            const [bearer, token] = accessToken.split(" ")
            userId = await jwtService.getUserIdByAccessToken(token)
        }

        const arrCommentsWithCounts = await Promise.all(getCommentsDB.map( async (elem):Promise<CommentType> => {

            const likesCount =  await likeStatusRepo.likesCount(elem.id)
            const dislikesCount =  await likeStatusRepo.dislikeCount(elem.id)
            const object = await likeStatusRepo.getObjectWithCommentIdLikeStatusUserId(elem.id, userId)
            return {
                id: elem.id,
                content: elem.content,
                commentatorInfo: {
                    userId:elem.commentatorInfo.userId,
                    userLogin: elem.commentatorInfo.userLogin
                },
                createdAt: elem.createdAt,
                likesInfo: {
                    likesCount,
                    dislikesCount,
                    myStatus: object ? object.likeStatus : 'None'
                }
            }
        }))

        if(getCommentsDB.length > 0) {
            return {
                pagesCount,
                page: pageNumber,
                pageSize: pageSize,
                totalCount: commentsTotal,
                items: arrCommentsWithCounts
            }
        }
        else {
            return null;
        }

    }
}

