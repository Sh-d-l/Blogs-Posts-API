import {Request, Response, Router} from "express";
import {jwtService} from "../application/jwt-service";
import {TUsersDb} from "../types/types";
import {authMiddleware} from "../middlewares/authMiddleware";
import {
    confirmCodeValidation,
    createNewUserValidation, refreshTokenFromCookieValidation, resendingEmailValidation,
} from "../middlewares/validators/validations";
import {createUserService} from "../users_API-service/userService";


export const authRouter = Router({})

authRouter.post("/login",
    async (req: Request, res: Response) => {
        const authUser: TUsersDb | null = await createUserService
            .authUserWithEmailService(req.body.loginOrEmail, req.body.password)
        if (authUser) {
            const accessToken = await jwtService.createAccessToken(authUser.id)
            const refreshToken = await jwtService.createRefreshToken(authUser.id)
                 res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,})
                .status(200)
                .send({accessToken})
        } else {
            res.sendStatus(401)
        }
    })

authRouter.post("/refresh-token",
    ...refreshTokenFromCookieValidation,
    async (req: Request, res: Response) => {
        const tokensArray = await createUserService.refreshingTokensService(req.cookies.refreshToken)
        if (tokensArray) {
             res.status(200)
                .cookie('refreshToken', tokensArray[1], {httpOnly: true, secure: true,})
                .send({accessToken: tokensArray[0]})
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
        const cookies = req.cookies.refreshToken
        const correctRefreshToken: boolean = await createUserService.logoutService(cookies)
        if(correctRefreshToken) {
            res.cookie(cookies, "", {maxAge: 0}).status(204).send()
        }
        else {
            res.sendStatus(401)
        }
    }
)
authRouter.get("/me",
    authMiddleware,
    async (req: Request, res: Response) => {
        return res.send({login: req.user?.login, email: req.user?.email, userId: req.user?.id})
    })