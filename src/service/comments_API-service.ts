import {CommentType} from "../types/types";
import {commentsRepo} from "../repositories/comments_API-repositories";

class CommentsService {
    async getCommentById(id:string):Promise<CommentType | null> {
        return await commentsRepo.getCommentById(id)
    }
    async commentUpdate(id:string, content:string): Promise<boolean> {
        return await commentsRepo.commentUpdateRepo(id, content)
    }
    async commentDelete(id:string): Promise<boolean> {
        return await commentsRepo.commentDeleteDB(id)
    }
}
export const commentsService = new CommentsService()