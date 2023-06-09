import {Response, Request, Router} from "express";
import {authMiddleware} from "../middlewares/validators/authMiddleware";
import {commentsService} from "../comments_API-service/comments_API-service";
import {createCommentValidation} from "../middlewares/validators/validations";
import {CommentType} from "../post_API-repositories/post_API-repositories-db";

export const commentsRouter = Router({})

commentsRouter.get("/:id", async (req: Request, res: Response) => {
    const getCommentById = await commentsService.getCommentById(req.params.id)
    if (getCommentById) {
        res.status(200).send(getCommentById)
    } else {
        res.sendStatus(404)
    }
})
commentsRouter.put("/:commentId",
    authMiddleware,
    ...createCommentValidation,
    async (req: Request, res: Response) => {
        // const getCommentById: CommentType | null = await commentsService.getCommentById(req.params.commentId)
        // if (req.user?.id !== getCommentById?.commentatorInfo.userId) {
        //     res.sendStatus(403)
        // }
        const commentUpdate: boolean = await commentsService.commentUpdate(req.params.commentId, req.body.comment)
        if (commentUpdate) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })
commentsRouter.delete("/:commentId",
    authMiddleware,
    async (req: Request, res: Response) => {
        // const getCommentById: CommentType | null = await commentsService.getCommentById(req.params.commentId)
        // if (req.user?.id !== getCommentById?.commentatorInfo.userId) {
        //     res.sendStatus(403)
        // }
        const delComment: boolean = await commentsService.commentDelete(req.params.commentId)
        if (delComment) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })