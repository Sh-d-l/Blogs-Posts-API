import {Request, Response, NextFunction} from "express";
import {jwtService} from "../application/jwt-service";
import {container} from "../composition-root";
import {CommentsRepo} from "../repositories/comments_API-repositories";
const commentsRepo = container.resolve(CommentsRepo)
export const checkUserIdMiddleware = async(req: Request, res: Response, next: NextFunction)  => {
    const getCommentById = await commentsRepo.getCommentById(req.params.commentId)
    if (!getCommentById) {
        res.sendStatus(404)
        return
    }
    const auth = req.headers.authorization
    const userId = await jwtService.getUserIdByAccessToken(auth!.split(" ") [1])
    if (userId !== getCommentById.commentatorInfo.userId) {
        res.sendStatus(403)
        return
    } else {
        next()
    }
}



