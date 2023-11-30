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

        const object = await this.likeStatusRepo.getObjectWithCountAndInfoUsers(commentId)
        if(!object && likeStatus === "like") {
            const object = {
                commentId,
                likeCount: 1,
                dislikeCount: 0,
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
        if(!object && likeStatus === "Dislike") {
            const object = {
                commentId,
                likeCount: 0,
                dislikeCount: 1,
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

        if(object && likeStatus === "like") {

        }

        const commentById: CommentType | null = await this.commentsRepo.getCommentById(commentId)
        if (!commentById) return false

        else return  false
    }

    async getCommentById(id: string): Promise<CommentType | null> {
        return await this.commentsRepo.getCommentById(id)
    }

    async commentUpdate(id: string, content: string): Promise<boolean> {
        return await this.commentsRepo.commentUpdateRepo(id, content)
    }

    async commentDelete(id: string): Promise<boolean> {
        return await this.commentsRepo.commentDeleteDB(id)
    }
}
