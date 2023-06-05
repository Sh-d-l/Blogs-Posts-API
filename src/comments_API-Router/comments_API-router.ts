import {Response, Request, Router} from "express";
import {authMiddleware} from "../middlewares/validators/authMiddleware";
import {commentsService} from "../comments_API-service/comments_API-service";
import {createCommentValidation} from "../middlewares/validators/validations";


export const commentsRouter = Router({})

commentsRouter.get("/:id", async (req:Request, res:Response) => {
    const getCommentById = await commentsService.getCommentById(req.params.id)
    if(getCommentById) {
        res.status(200).send(getCommentById)
    }
    else {
        res.sendStatus(404)
    }
})

commentsRouter.put("/:commentId",
    authMiddleware,
    ...createCommentValidation,
    async (req:Request, res:Response) => {
    const commentUpdate:boolean = await commentsService.commentUpdate(req.params.id, req.body.comment)
        if(commentUpdate){
            res.sendStatus(204)
        }
        else{
            res.sendStatus(404)
        }
commentsRouter.delete("/:commentId"),
    authMiddleware,
    async (req:Request, res:Response) => {
    const delComment:boolean = await commentsService.commentDelete(req.params.id)
    if(delComment) {
        res.sendStatus(204)
    }
    else {
        res.sendStatus(404)
    }
    }


})