import {Response, Request, Router} from "express";
import {authMiddleware} from "../middlewares/authMiddleware";
import {createCommentValidation, likeStatusValidationArray} from "../middlewares/validators/validations";
import {CheckUserIdMiddleware, checkUserIdMiddleware} from "../middlewares/checkUserIdMiddleware";
import {CommentsService} from "../service/comments_API-service";

export const commentsRouter = Router({})
class CommentsController{
    commentsService:CommentsService;
    constructor() {
        this.commentsService = new CommentsService()
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

export const commentsController = new CommentsController()

commentsRouter.put("/:commentId/like-status",
    authMiddleware,
    ...likeStatusValidationArray,
    commentsController.makeLike)

commentsRouter.get("/:id", commentsController.getCommentById  )

commentsRouter.put("/:commentId",
    authMiddleware,
    checkUserIdMiddleware,
    ...createCommentValidation,
   commentsController.updateComment)

commentsRouter.delete("/:commentId",
    authMiddleware,
    checkUserIdMiddleware,
    commentsController.deleteCommentById )