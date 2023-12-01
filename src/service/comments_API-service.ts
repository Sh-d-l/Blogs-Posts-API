import {CommentType} from "../types/types";
import {CommentsRepo} from "../repositories/comments_API-repositories";
import {jwtService} from "../application/jwt-service";
import {LikeStatusRepo} from "../repositories/likeStatusRepo";
import {loginAnotherUser} from "../../test_constanse/user.constans";

export class CommentsService {
    constructor(protected commentsRepo: CommentsRepo, protected likeStatusRepo: LikeStatusRepo) {
    }
    async makeLikeService(commentId: string, likeStatus: string, accessToken: string | undefined): Promise<boolean> {
        const [bearer, token] = accessToken!.split(" ")
        const userId = await jwtService.getUserIdByAccessToken(token)
        const resultSearchByCommentId = await  this.likeStatusRepo.getObjectWithCommentId(commentId)
        if(!resultSearchByCommentId) {
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
        //console.log(userIdByUsersInfo, "userIdByUsersInfo")
        if (resultSearchByCommentId && !userIdByUsersInfo){

            const userInfo = {
                userId,
                likeStatus
            }
            await this.likeStatusRepo.addUserInfo(commentId,userInfo)
            return true
        }
        if(resultSearchByCommentId && userIdByUsersInfo) {
            // console.log(resultSearchByCommentId, "resultSearchByCommentId")
            // console.log(userIdByUsersInfo, "userIdByUsersInfo")
            await  this.likeStatusRepo.changeLikeStatusByUserId(userId,likeStatus)
            return true
        }
        else return  false
    }

    async getCommentById(id: string, accessToken:string | undefined): Promise<CommentType | null> {
        const [bearer, token] = accessToken!.split(" ")
        const userId = await jwtService.getUserIdByAccessToken(token)

        const comment = await this.commentsRepo.getCommentById(id)

        const likeInfoByUser = await this.likeStatusRepo.getObjectWithUsersInfo(userId)

        //const likesCount = await this.likeStatusRepo.
        return comment

    }

    async commentUpdate(id: string, content: string): Promise<boolean> {
        return await this.commentsRepo.commentUpdateRepo(id, content)
    }

    async commentDelete(id: string): Promise<boolean> {
        return await this.commentsRepo.commentDeleteDB(id)
    }
}
