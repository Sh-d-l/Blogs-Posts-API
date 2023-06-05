import {CommentType} from "../post_API-repositories/post_API-repositories-db";
import {commentsRepo} from "../comments_API-repositories/comments_API-repositories";

export const commentsService = {
    async getCommentById(id:string):Promise<CommentType | null> {
        return await commentsRepo.getCommentById(id)
    },
    async commentUpdate(id:string, content:string): Promise<boolean> {
        return await commentsRepo.commentUpdateRepo(id, content)
    },
    async commentDelete(id:string): Promise<boolean> {
        return await commentsRepo.commentDeleteDB(id)
    }

}