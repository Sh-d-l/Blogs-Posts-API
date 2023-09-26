import {Response, Request, Router} from "express";
import {authMiddleware} from "../middlewares/authMiddleware";
import {commentsService} from "../service/comments_API-service";
import {createCommentValidation} from "../middlewares/validators/validations";
import {checkUserIdMiddleware} from "../middlewares/checkUserIdMiddleware";

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
    checkUserIdMiddleware,
    authMiddleware,
    ...createCommentValidation,
    async (req: Request<{commentId: string}, {content: string}>, res: Response) => {
        const commentUpdate: boolean = await commentsService.commentUpdate(req.params.commentId, req.body.content)
        if (commentUpdate) {
            res.sendStatus(204)
        }
        else {
            res.sendStatus(404)
        }
    })
commentsRouter.delete("/:commentId",
    authMiddleware,
    checkUserIdMiddleware,
    async (req: Request, res: Response) => {
        const delComment: boolean = await commentsService.commentDelete(req.params.commentId)
        if (delComment) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })