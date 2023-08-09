import {Request, Response, Router} from "express";
import {TUsersDb} from "../types/types";
import {authMiddleware} from "../middlewares/authMiddleware";
import {
    confirmCodeValidation,
    createNewUserValidation, resendingEmailValidation,
} from "../middlewares/validators/validations";
import {createUserService} from "../service/userService";
import {customRateLimitMiddleware} from "../middlewares/customRateLimitMiddleware";

export const authRouter = Router({})

authRouter.post("/login",
    //customRateLimitMiddleware,
    async (req: Request, res: Response) => {
        const authUser = await createUserService
            .authUserWithEmailService(req.body.loginOrEmail, req.body.password,req.ip,req.baseUrl,req.headers["user-agent"])
        if (authUser) {
                 res.cookie('refreshToken', authUser[1], {httpOnly: true, secure: true,})
                .status(200)
                .send({"accessToken":authUser[0]})
        } else {
            res.sendStatus(401)
        }
    })

authRouter.post("/refresh-token",
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
    //customRateLimitMiddleware,
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
    //customRateLimitMiddleware,
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
    //customRateLimitMiddleware,
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