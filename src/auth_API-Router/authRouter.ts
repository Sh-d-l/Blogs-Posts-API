import {Request, Response, Router} from "express";
import {jwtService} from "../application/jwt-service";
import {TUsersDb} from "../types/types";
import {authMiddleware} from "../middlewares/authMiddleware";
import {
    confirmCodeValidation,
    createNewUserValidation, resendingEmailValidation,
} from "../middlewares/validators/validations";
import {createUserService} from "../users_API-service/userService";
import {log} from "util";

export const authRouter = Router({})

authRouter.post("/login",
    async (req: Request, res: Response) => {
        const authUser: TUsersDb | null = await createUserService
            .authUserWithEmailService(req.body.loginOrEmail, req.body.password)
        if (authUser) {
            const accessToken = await jwtService.createAccessToken(authUser.id)
            const refreshToken = await jwtService.createRefreshToken(authUser.id)
            res.cookie('cookie_name', refreshToken, {httpOnly: true, secure: true,})
            res.status(200).send({accessToken})
            return
        } else {
            res.sendStatus(401)
        }
    })

authRouter.post("/refresh-token",
    async (req: Request, res: Response) => {
        console.log(req.cookies.cookie_name)
        const tokensArray = await createUserService.refreshingTokensService(req.cookies.cookie_name)
        if (tokensArray) {
            res.status(200).send({accessToken: tokensArray[0]})
            res.cookie('refresh token', tokensArray[1], {httpOnly: true, secure: true,})
            return
        } else {
            res.sendStatus(401)
        }
    })

authRouter.post("/registration",
    ...createNewUserValidation,
    async (req: Request, res: Response) => {
        const userRegWithMail: TUsersDb | null = await createUserService
            .createUserWithEmailService(req.body.login,
                req.body.password,
                req.body.email)
        //req.socket.remoteAddress)
        if (userRegWithMail) {
            res.sendStatus(204)
            return
        } else {
            res.sendStatus(400)
        }
    })
authRouter.post("/registration-confirmation",
    ...confirmCodeValidation,
    async (req: Request, res: Response) => {
        const updateIsConfirmed = await createUserService.confirmationCodeService(req.body.code)
        if (updateIsConfirmed) {
            res.sendStatus(204)
            return
        }
    }
)
authRouter.post("/registration-email-resending",
    ...resendingEmailValidation,
    async (req: Request, res: Response) => {
        const resendingEmail = await createUserService.resendingEmailService(req.body.email)
        if (resendingEmail) {
            res.sendStatus(204)
            return
        }
    }
)
authRouter.post("/logout",
    async (req: Request, res: Response) => {
        const cookies = req.cookies.cookie_name
        res.cookie(cookies, "", {maxAge: 0})
    }
)
authRouter.get("/me",
    authMiddleware,
    async (req: Request, res: Response) => {
        return res.send({login: req.user?.login, email: req.user?.email, userId: req.user?.id})
    })