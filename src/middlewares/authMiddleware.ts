import {Request, Response, NextFunction} from "express";
import {jwtService} from "../application/jwt-service"
import {container} from "../composition-root";
import {CreateUserService} from "../service/userService";

//import {createUserService} from "../service/userService";
const userService = container.resolve(CreateUserService)
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization
    if (!auth) {
        res.sendStatus(401)
        return
    }

    const [authType, token] = auth.split(" ")
    if(authType !== 'Bearer')  return res.sendStatus(401)
    const userId = await jwtService.getUserIdByAccessToken(token)
    if (userId) {
        req.user = await userService.findUserByIdWithMailService(userId)
        return next()
    }
    return res.sendStatus(401)
}