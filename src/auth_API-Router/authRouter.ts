import {Request, Response, Router} from "express";
import {usersService} from "../users_API-service/users_API-service";
import {jwtService} from "../application/jwt-service";
import {TUsersDb} from "../users_API-repositories/usersRepositoriesQuery";
import {authMiddleware} from "../middlewares/authMiddleware";
import {createNewUser} from "../middlewares/validators/validations";
import {usersRepoDb} from "../users_API-repositories/users_API-repositories-db";

export const authRouter = Router({})

authRouter.post("/login",
    async (req: Request, res: Response) => {
    const authUser: TUsersDb | null = await usersService
        .authUserService(req.body.loginOrEmail, req.body.password)
    if (authUser) {
        const token = await jwtService.createJwt(authUser)
        res.status(200).send({accessToken: token})
        return
    } else {
        res.sendStatus(401)
    }
})
authRouter.post("/registration",
    ...createNewUser,
    async(req:Request,res:Response) => {
        const previouslyRegisteredUser = await usersRepoDb.findUserByLoginEmail(req.body.email)
        if(previouslyRegisteredUser) {
            res.sendStatus(400)
            return
        }
    const userRegWithMail = await usersService
        .createUserServiceWithEmail(req.body.login,
        req.body.password,
        req.body.email)
        if(userRegWithMail) {
            res.sendStatus(204)
            return
        }
})
authRouter.get("/me",
    authMiddleware,
    async (req: Request, res: Response) => {
        return res.send({login: req.user?.login, email: req.user?.email, userId:req.user?.id})
    })