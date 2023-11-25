import {Response, Request} from "express";
import {CommentsService} from "../service/comments_API-service";

export class CommentsController {
    constructor(protected commentsService:CommentsService) {
    }
    async makeLike(req:Request,res:Response) {
        const makeLikeOfComment = await  this.commentsService.makeLikeService(req.params.commentId, req.body.likeStatus)
        //console.log(makeLikeOfComment, "comment with like")
        if (makeLikeOfComment) {
            res.sendStatus(204)
        }
        else {
            res.sendStatus(404)
        }
    }

    async getCommentById(req: Request, res: Response){
        const getCommentById = await this.commentsService.getCommentById(req.params.id)
        if (getCommentById) {
            res.status(200).send(getCommentById)
        } else {
            res.sendStatus(404)
        }
    }
    async updateComment(req: Request, res: Response){
        const commentUpdate: boolean = await this.commentsService.commentUpdate(req.params.commentId, req.body.content)
        if (commentUpdate) {
            res.sendStatus(204)
        }
        else {
            res.sendStatus(404)
        }
    }
    async deleteCommentById(req: Request, res: Response){
        const delComment: boolean = await this.commentsService.commentDelete(req.params.commentId)
        if (delComment) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }
}



