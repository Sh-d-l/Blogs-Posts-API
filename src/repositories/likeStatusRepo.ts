import {LikeStatusOfComment} from "../types/types";
import {LikeStatusOfCommentModel} from "../mongoDB/db";
import "reflect-metadata";
import {injectable} from "inversify";
@injectable()
export class LikeStatusRepo {
    async getObjectWithCommentIdLikeStatusUserId(commentId:string, userId: string | null):Promise<LikeStatusOfComment | null> {
        return LikeStatusOfCommentModel.findOne({commentId,userId})
    }
    async addLikeStatusOfCommentObjectToDB(object: LikeStatusOfComment) {
        await LikeStatusOfCommentModel.create({...object})
    }
    async changeLikeStatusByUserId(commentId:string, userId: string | null, likeStatus: string) {
        await LikeStatusOfCommentModel.updateOne({commentId, userId}, {likeStatus})
    }
    async likesCount(commentId: string):Promise<number>{
        return  LikeStatusOfCommentModel.countDocuments({commentId,likeStatus: 'Like'})
    }
    async dislikeCount(commentId: string):Promise<number> {
        return  LikeStatusOfCommentModel.countDocuments({commentId, likeStatus: 'Dislike'})
    }

}
