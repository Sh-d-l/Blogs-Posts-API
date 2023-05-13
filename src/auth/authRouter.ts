import {Request, Response, Router} from "express";
import {usersService} from "../users_API-service/users_API-service";

export const authRouter = Router({})

authRouter.post ("/login", async(req:Request, res:Response) => {
        const authUser:boolean = await usersService
            .authUserService(req.body.loginOrEmail, req.body.password)
        authUser ? res.sendStatus(204) : res.sendStatus(401)
})