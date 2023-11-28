import {TypeLikeStatusOfComment} from "../types/types";
import {LikeStatusOfCommentModel} from "../mongoDB/db";

export class LikeStatusRepo {
    async addLikeStatusOfCommentObjectToDB(object: TypeLikeStatusOfComment) {
        await LikeStatusOfCommentModel.create({...object})
    }



}
