import {Request, Response, Router} from "express";
import {usersService} from "../users_API-service/users_API-service";
import {jwtService} from "../../application/jwt-service";
import {TUsersDb} from "../users_API-repositories/usersRepositoriesQuery";

export const authRouter = Router({})

authRouter.post ("/login", async(req:Request, res:Response) => {
        const authUser:TUsersDb | null = await usersService
            .authUserService(req.body.loginOrEmail, req.body.password)
        if(authUser) {
                const token = await jwtService.createJwt(authUser)
                res.status(200).send(token)
        }
        else {
                res.status(401)
        }
})