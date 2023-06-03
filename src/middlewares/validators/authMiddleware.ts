import {Request, Response, NextFunction} from "express";
import {jwtService} from "../../../application/jwt-service";
import {usersService} from "../../users_API-service/users_API-service";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401)
        return
    }
    const token = req.headers.authorization.split(" ")[1]
    const userId:string = await jwtService.getUserIdByToken(token)
    if (userId) {
        req.user = await usersService.findUserByIdService(userId)
        next()
    }
    res.sendStatus(401)
}