import {Response, Request, Router} from "express";
import {authMiddleware} from "../middlewares/authMiddleware";
import {createCommentValidation, likeStatusValidationArray} from "../middlewares/validators/validations";
import {checkUserIdMiddleware} from "../middlewares/checkUserIdMiddleware";
import {CommentsService} from "../service/comments_API-service";
import { commentsController, commentsService} from "../composition-root";

export const commentsRouter = Router({})

export class CommentsController {
    constructor(protected commentsService:CommentsService) {
    }
    async makeLike(req:Request,res:Response) {
        const makeLikeOfComment = await  this.commentsService.makeLikeService(req.params.id, req.body.likeStatus)
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



commentsRouter.put("/:commentId/like-status",
    authMiddleware,
    ...likeStatusValidationArray,
    commentsController.makeLike.bind(commentsController))

commentsRouter.get("/:id", commentsController.getCommentById.bind(commentsController)  )

commentsRouter.put("/:commentId",
    authMiddleware,
    checkUserIdMiddleware,
    ...createCommentValidation,
   commentsController.updateComment.bind(commentsController))

commentsRouter.delete("/:commentId",
    authMiddleware,
    checkUserIdMiddleware,
    commentsController.deleteCommentById.bind(commentsController) )