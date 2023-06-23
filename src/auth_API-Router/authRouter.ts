import {Request, Response, Router} from "express";
import {usersService} from "../users_API-service/users_API-service";
import {jwtService} from "../application/jwt-service";
import {TUsersDb} from "../users_API-repositories/usersRepositoriesQuery";
import {authMiddleware} from "../middlewares/authMiddleware";
import {
    confirmCodeValidation,
    createNewUserValidation,
    userEmailValidation
} from "../middlewares/validators/validations";
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
    ...createNewUserValidation,
    async (req: Request, res: Response) => {
        const previouslyRegisteredUser = await usersRepoDb.findUserByLoginEmail(req.body.email,req.body.login)
        if (previouslyRegisteredUser) {
            res.sendStatus(400)
            return
        }
        const userRegWithMail: TUsersDb | null = await usersService
            .createUserServiceWithEmail(req.body.login,
                req.body.password,
                req.body.email)
        if (userRegWithMail) {
            res.sendStatus(204)
            return
        }
    })
authRouter.post("/registration-confirmation",
    ...confirmCodeValidation,
    async (req: Request, res: Response) => {
        const updateIsConfirmed = await usersService.confirmationCodeService(req.body.code)
        if (updateIsConfirmed) {
            res.sendStatus(204)
        } else {
            res.sendStatus(400)
        }
    }
)
authRouter.post("/registration-email-resending",
    ...userEmailValidation,
    async (req: Request, res: Response) => {
        const resendingEmail = await usersService.resendingEmailService(req.body.email)
        if (resendingEmail) {
            res.sendStatus(204)
            return
        } else {
            res.sendStatus(400)
            return
        }
    }
)
authRouter.get("/me",
    authMiddleware,
    async (req: Request, res: Response) => {
        return res.send({login: req.user?.login, email: req.user?.email, userId: req.user?.id})
    })