
import {CommentType} from "../post_API-repositories/post_API-repositories-db";
import {commentCollection} from "../repositories/db";

export const commentsRepo = {
    async getCommentById(id: string): Promise<CommentType | null> {
        return commentCollection.findOne({id}, {projection: {_id: 0}})
    },
    async commentUpdateRepo(id: string, content: string): Promise<boolean> {
        console.log(id,content)
        const updateCommentDB = await commentCollection.updateOne({id}, {$set:{content}})
        console.log(updateCommentDB)
        return !!updateCommentDB.matchedCount
    },
    async commentDeleteDB(id: string): Promise<boolean> {
        const delCommentDB = await commentCollection.deleteOne({id})
        return !!delCommentDB.deletedCount
    }
}