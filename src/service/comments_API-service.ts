import {CommentsRepo} from "../repositories/comments_API-repositories";
import {jwtService} from "../application/jwt-service";
import {LikeStatusRepo} from "../repositories/likeStatusRepo";

export class CommentsService {
    constructor(protected commentsRepo: CommentsRepo, protected likeStatusRepo: LikeStatusRepo) {
    }
    async makeLikeService(commentId: string, likeStatus: string, accessToken: string | undefined): Promise<boolean> {
        const [bearer, token] = accessToken!.split(" ")
        const userId = await jwtService.getUserIdByAccessToken(token)

        const resultSearchByCommentId = await  this.likeStatusRepo.getObjectWithCommentIdLikeStatusUserId(commentId, userId)
        if(!resultSearchByCommentId) {
            const object = {
                commentId,
                userId,
                likeStatus,
            }
            await this.likeStatusRepo.addLikeStatusOfCommentObjectToDB(object)
            return true
        }

        if (resultSearchByCommentId ){
            await this.likeStatusRepo.changeLikeStatusByUserId(commentId,userId,likeStatus)
            return true
        }
        else return  false
    }

    async getCommentById(commentId: string, refreshToken:string): Promise<{ createdAt: string | undefined; commentatorInfo: { userLogin: string | undefined; userId: string | undefined }; id: string | undefined; content: string | undefined; likesInfo: { likesCount: number; dislikesCount: number; myStatus: any } }> {
        const arrFromRefreshToken = await  jwtService.getPayloadRefreshToken(refreshToken)
        const comment = await this.commentsRepo.getCommentById(commentId)
        const object = await this.likeStatusRepo.getObjectWithCommentIdLikeStatusUserId(commentId, arrFromRefreshToken![2])

        const likesCount = await  this.likeStatusRepo.likesCount(commentId )
        const dislikesCount = await this.likeStatusRepo.dislikeCount(commentId)

         return {
            id: comment?.id,
             content: comment?.content,
             commentatorInfo: {
                userId: comment?.commentatorInfo.userId,
                 userLogin: comment?.commentatorInfo.userLogin,
             },
             createdAt:comment?.createdAt,
             likesInfo: {
                likesCount,
                 dislikesCount,
                 myStatus: object!.likeStatus
             }
         }

    }

    async commentUpdate(id: string, content: string): Promise<boolean> {
        return await this.commentsRepo.commentUpdateRepo(id, content)
    }

    async commentDelete(id: string): Promise<boolean> {
        return await this.commentsRepo.commentDeleteDB(id)
    }
}
