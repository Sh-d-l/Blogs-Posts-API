import {CommentType} from "../types/types";
import {CommentsRepo} from "../repositories/comments_API-repositories";
import {jwtService} from "../application/jwt-service";

export class CommentsService {
    constructor(protected  commentsRepo:CommentsRepo) {
    }
    async makeLikeService(id: string, likeStatus: string, accessToken: string | undefined):Promise<boolean> {
        const commentById:CommentType | null = await this.commentsRepo.getCommentById(id)
        if(accessToken) {
            const [bearer,token] = accessToken.split(" ")
            const userId = await jwtService.getUserIdByAccessToken(token)
            console.log(userId)
        }


        if (commentById) {
            await this.commentsRepo.updateLikesInfo(id, likeStatus)
            return  true
        }
        else return false
    }

    async getCommentById(id:string):Promise<CommentType | null> {
        return await this.commentsRepo.getCommentById(id)
    }
    async commentUpdate(id:string, content:string): Promise<boolean> {
        return await this.commentsRepo.commentUpdateRepo(id, content)
    }
    async commentDelete(id:string): Promise<boolean> {
        return await this.commentsRepo.commentDeleteDB(id)
    }
}
