import {CommentType} from "../types/types";
import {CommentsRepo} from "../repositories/comments_API-repositories";
import {jwtService} from "../application/jwt-service";
import {LikeStatusRepo} from "../repositories/likeStatusRepo";

export class CommentsService {
    constructor(protected commentsRepo: CommentsRepo, protected likeStatusRepo: LikeStatusRepo) {
    }
    async makeLikeService(commentId: string, likeStatus: string, accessToken: string | undefined): Promise<boolean> {
        const [bearer, token] = accessToken!.split(" ")
        const userId = await jwtService.getUserIdByAccessToken(token)
        const commentById = await this.commentsRepo.getCommentById(commentId)
        const resultSearchByCommentId = await  this.likeStatusRepo.getObjectWithCommentId(commentId)
        if(!resultSearchByCommentId && commentById) {
            const object = {
                commentId,
                usersInfo: [
                    {
                        userId,
                        likeStatus,
                    }
                ]
            }
            await this.likeStatusRepo.addLikeStatusOfCommentObjectToDB(object)
            return true
        }
        const userIdByUsersInfo = await this.likeStatusRepo.getObjectWithUsersInfo(userId)
        if (resultSearchByCommentId && !userIdByUsersInfo){
            const userInfo = {
                userId,
                likeStatus
            }
            await this.likeStatusRepo.addUserInfo(commentId,userInfo)
            return true
        }
        if(resultSearchByCommentId && userIdByUsersInfo) {
            await  this.likeStatusRepo.changeLikeStatusByUserId(userId,likeStatus)
            return true
        }
        else return  false
    }

    async getCommentById(id: string, refreshToken:string): Promise<{ createdAt: string | undefined; commentatorInfo: { userLogin: string | undefined; userId: string | undefined }; id: string | undefined; content: string | undefined; likesInfo: { likesCount: number; dislikesCount: number; myStatus: any } }> {
        const userIdFromRefreshToken = await  jwtService.getPayloadRefreshToken(refreshToken)
        const comment = await this.commentsRepo.getCommentById(id)
        const likesInfoObject = await  this.likeStatusRepo.getObjectWithCommentId(id)
        //console.log(likesInfoObject, "likesInfoObject")
        const newArrLike = []
        const newArrDislike = []
        const thisUserArr = []
        for (const like of likesInfoObject!.usersInfo) {
            if(like.likeStatus === "Like") newArrLike.push({like})
            if(like.likeStatus === "Dislike") newArrDislike.push({like})
        }
        for(const objectFromUsersInfoArr of likesInfoObject!.usersInfo) {
            if(objectFromUsersInfoArr.userId === userIdFromRefreshToken![2]) thisUserArr.push(objectFromUsersInfoArr)
        }
        // console.log(newArrLike, "newArrLike")
        // console.log(newArrDislike, "newArrDislike")
        //  console.log(thisUserArr, "thisUserArr")
        // console.log(thisUserArr[0]!.likeStatus, "likeStatus")

         return {
            id: comment?.id,
             content: comment?.content,
             commentatorInfo: {
                userId: comment?.commentatorInfo.userId,
                 userLogin: comment?.commentatorInfo.userLogin,
             },
             createdAt:comment?.createdAt,
             likesInfo: {
                likesCount:newArrLike.length,
                 dislikesCount:newArrDislike.length,
                 myStatus: thisUserArr[0].likeStatus
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
