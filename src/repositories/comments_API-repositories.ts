import {CommentType} from "../types/types";
import {CreateCommentByPostIDModel} from "../mongoDB/db";

export class CommentsRepo {

    async getCommentById(id: string): Promise<CommentType | null> {
        return CreateCommentByPostIDModel.findOne({id}, {_id: 0, postId:0 , __v:0})
    }
    async commentUpdateRepo(id: string, content: string): Promise<boolean> {
            const updateCommentDB = await CreateCommentByPostIDModel.updateOne({id}, {content})
        return !!updateCommentDB
    }
    async commentDeleteDB(id: string): Promise<boolean> {
        const delCommentDB = await CreateCommentByPostIDModel.deleteOne({id})
        return !!delCommentDB
    }
}
