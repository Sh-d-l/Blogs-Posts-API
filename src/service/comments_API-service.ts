import {CommentType} from "../types/types";
import {CommentsRepo} from "../repositories/comments_API-repositories";

export class CommentsService {
    constructor(protected  commentsRepo:CommentsRepo) {
    }
    async makeLikeService(id:string, likeStatus: string):Promise<boolean> {
        const commentById = await this.commentsRepo.getCommentById(id)
        if(!commentById) return  false
        if (likeStatus === "None" && commentById?.likesInfo.myStatus === "Like") {
            await this.commentsRepo.updateLikesInfoIfNoneAfterLike(id, likeStatus)
            return true
        }
        if (likeStatus === "None" && commentById?.likesInfo.myStatus === "Dislike") {
            await this.commentsRepo.updateLikesInfoIfNoneAfterDislike(id, likeStatus)
            return true
        }
        if (likeStatus === "like" && commentById?.likesInfo.myStatus === "Dislike") {
            await this.commentsRepo.updateLikesInfoIfLikeAfterDislike(id, likeStatus)
            return true
        }
        if (likeStatus === "Dislike" && commentById?.likesInfo.myStatus === "Like") {
            await this.commentsRepo.updateLikesInfoIfDislikeAfterLike(id, likeStatus)
            return true
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
