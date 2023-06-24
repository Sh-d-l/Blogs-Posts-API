import {Request, Response, NextFunction} from "express";
import {jwtService} from "../application/jwt-service";
import {CommentType} from "../types/types";
import {commentsService} from "../comments_API-service/comments_API-service";
export const checkUserIdMiddleware = async (req:Request, res:Response, next:NextFunction) => {
    const getCommentById: CommentType | null = await commentsService.getCommentById(req.params.commentId)
    const userId = await jwtService.getUserIdByToken(req.headers.authorization!.split(" ")[1])
    if(!getCommentById) {
        res.sendStatus(404)
        return
    }
    if (userId !== getCommentById.commentatorInfo.userId) {
        res.sendStatus(403)
        return
    }
    else {
        next()
    }
}