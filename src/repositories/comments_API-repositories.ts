import {CommentType} from "../types/types";
import {CreateCommentByPostIDModel} from "../mongoDB/db";

export class CommentsRepo {
    async updateLikesInfo (id:string, likesInfo:string): Promise<boolean> {
        return
    }

    async getCommentById(id: string): Promise<CommentType | null> {
        return CreateCommentByPostIDModel.findOne({id}, {projection: {_id: 0, postId:false}})
    }
    async commentUpdateRepo(id: string, content: string): Promise<boolean> {
        const updateCommentDB = await CreateCommentByPostIDModel.updateOne({id}, {$set:{content}})
        return !!updateCommentDB
    }
    async commentDeleteDB(id: string): Promise<boolean> {
        const delCommentDB = await CreateCommentByPostIDModel.deleteOne({id})
        return !!delCommentDB
    }
}
