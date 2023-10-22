import {CommentType} from "../types/types";
import {CommentsRepo} from "../repositories/comments_API-repositories";

export class CommentsService {
    commentsRepo:CommentsRepo;
    constructor() {
        this.commentsRepo = new CommentsRepo()
    }
    async makeLikeService(id:string, likeStatus: string):Promise<boolean> {
        const commentById = await this.commentsRepo.getCommentById(id)
        if
        let likesCount = 0;
        let dislikesCount = 0;
        if (likeStatus === "like") {
            likesCount += 1;
        }
        if (likeStatus === "Dislike") {
            dislikesCount += 1;
        }

        return await this.commentsRepo.updateLikesInfo(id,likeStatus)
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
