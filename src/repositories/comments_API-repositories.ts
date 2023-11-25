import {CommentType} from "../types/types";
import {CreateCommentByPostIDModel} from "../mongoDB/db";

export class CommentsRepo {
    async updateLikesInfoIfLikeAfterNone (id:string, myStatus:string): Promise<boolean>{
        const updateLikesInfoIfLikeAfterNone = CreateCommentByPostIDModel.updateOne({id},{"likesInfo.myStatus":myStatus})
        //console.log(updateLikesInfoIfLikeAfterNone,"updateLikesInfoIfLikeAfterNone")
        return !!updateLikesInfoIfLikeAfterNone
    }
    async updateLikesInfoIfDislikeAfterNone (id:string, myStatus:string): Promise<boolean> {
        const updateLikesInfoIfDislikeAfterNone = CreateCommentByPostIDModel.updateOne({id},{$inc:{"likesInfo:dislikesCount":+1}, "likesInfo.myStatus":myStatus})
        return !!updateLikesInfoIfDislikeAfterNone
    }
    async updateLikesInfoIfNoneAfterLike (id:string, myStatus:string): Promise<boolean> {
        const updateLikesInfoIfNoneAfterLike =  CreateCommentByPostIDModel.updateOne({id},{$inc:{"likesInfo:likesCount":-1}, "likesInfo.myStatus":myStatus})
        return !!updateLikesInfoIfNoneAfterLike
    }
    async updateLikesInfoIfNoneAfterDislike (id:string, myStatus:string): Promise<boolean> {
         const updateLikesInfoIfNoneAfterDislike = CreateCommentByPostIDModel.updateOne({id},{$inc:{"likesInfo:dislikesCount":-1}, "likesInfo.myStatus":myStatus})
        return !!updateLikesInfoIfNoneAfterDislike
    }
    async updateLikesInfoIfLikeAfterDislike(id:string, myStatus:string): Promise<boolean>{
         const updateLikesInfoIfLikeAfterDislike =  CreateCommentByPostIDModel.updateOne({id},{$inc:{"likesInfo:dislikesCount":-1, "likesInfo:likesCount":+1 }, "likesInfo.myStatus":myStatus})
        return !!updateLikesInfoIfLikeAfterDislike
    }
    async updateLikesInfoIfDislikeAfterLike(id:string, myStatus:string): Promise<boolean>{
        const updateLikesInfoIfDislikeAfterLike = CreateCommentByPostIDModel.updateOne({id},{$inc:{"likesInfo:dislikesCount":+1, "likesInfo:likesCount":-1 }, "likesInfo.myStatus":myStatus})
        return !!updateLikesInfoIfDislikeAfterLike
    }

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
