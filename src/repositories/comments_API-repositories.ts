
import {CommentType} from "../types/types";
import {commentCollection} from "./db";

export const commentsRepo = {
    async getCommentById(id: string): Promise<CommentType | null> {
        return commentCollection.findOne({id}, {projection: {_id: 0, postId:false}})
    },
    async commentUpdateRepo(id: string, content: string): Promise<boolean> {
        const updateCommentDB = await commentCollection.updateOne({id}, {$set:{content}})
        return !!updateCommentDB.matchedCount
    },
    async commentDeleteDB(id: string): Promise<boolean> {
        const delCommentDB = await commentCollection.deleteOne({id})
        return !!delCommentDB.deletedCount
    }
}