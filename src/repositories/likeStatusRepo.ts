import {TypeLikeStatusOfComment} from "../types/types";
import {LikeStatusOfCommentModel} from "../mongoDB/db";

export class LikeStatusRepo {
    async getObjectWithCountAndInfoUsers(id:string):Promise<TypeLikeStatusOfComment | null> {
        return LikeStatusOfCommentModel.findOne({id},{_id: 0, __v:0})
    }
    async addLikeStatusOfCommentObjectToDB(object: TypeLikeStatusOfComment) {
        await LikeStatusOfCommentModel.create({...object})
    }



}
