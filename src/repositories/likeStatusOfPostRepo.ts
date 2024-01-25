import {injectable} from "inversify";
import {LikeStatusOfPost} from "../types/types";
import {LikeStatusOfPostModel} from "../mongoDB/db";

@injectable()
export class LikeStatusOfPostRepo {
    async addObjectWithLikeStatusOfPostToDB(object:LikeStatusOfPost) {
        await LikeStatusOfPostModel.create({...object})
    }
    async getObjectWithLikeStatusOfPost(postId: string, userId: string | null):Promise<LikeStatusOfPost | null> {
        return LikeStatusOfPostModel.findOne({postId, userId})
    }
    async changeLikeStatusOfPostByUserId(postId: string, userId: string | null, likeStatus:string) {
        await LikeStatusOfPostModel.updateOne({postId, userId}, {likeStatus})
    }

}