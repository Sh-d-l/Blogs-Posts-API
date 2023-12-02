import {TypeLikeStatusOfComment} from "../types/types";
import {LikeStatusOfCommentModel} from "../mongoDB/db";

export class LikeStatusRepo {
    async getObjectWithCommentId(commentId:string):Promise<TypeLikeStatusOfComment | null> {
        return LikeStatusOfCommentModel.findOne({commentId},{_id: 0, __v:0})
    }
    async getObjectWithUsersInfo(userId: string | null):Promise<boolean> {
        return LikeStatusOfCommentModel.find({userId})
    }
    async addLikeStatusOfCommentObjectToDB(object:{commentId:string, usersInfo:{userId:string | null, likeStatus:string}[]}) {
        await LikeStatusOfCommentModel.create({...object})
    }
    async changeLikeStatusByUserId(userId: string | null, likeStatus: string) {
        const a = await LikeStatusOfCommentModel.updateOne({"usersInfo.userId":userId}, {} )
        console.log(a,"a")
    }
    async addUserInfo(commentId: string, object: { likeStatus: string; userId: string | null }) {
         await LikeStatusOfCommentModel.updateOne({commentId},{$push:{usersInfo:object}})
    }
    // async findLike(commentId:string):Promise<TypeLikeStatusOfComment> {
    //     return await LikeStatusOfCommentModel.find({"usersInfo.likeStatus": "Like"})
    // }



}
