import {Request, Response, NextFunction} from "express";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../users_API-service/users_API-service";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization
    if (!auth) {
        res.sendStatus(401)
        return
    }
    const [authType, token] = auth.split(" ")
    if(authType !== 'Bearer') return res.sendStatus(401)
    const userId = await jwtService.getUserIdByToken(token)
    if (userId) {
        req.user = await usersService.findUserByIdService(userId)
        return next()
    }
    return res.sendStatus(401)
}