import {Request, Response, Router} from "express";
import {jwtService} from "../application/jwt-service";
import {TUsersDb} from "../types/types";
import {authMiddleware} from "../middlewares/authMiddleware";
import {
    confirmCodeValidation,
    createNewUserValidation, resendingEmailValidation,
} from "../middlewares/validators/validations";
import {createUserService} from "../users_API-service/userService";

export const authRouter = Router({})

authRouter.post("/login",
    async (req: Request, res: Response) => {
        const authUser: TUsersDb | null = await createUserService
            .authUserWithEmailService(req.body.loginOrEmail, req.body.password)
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
        const userRegWithMail: TUsersDb | null = await createUserService
            .createUserWithEmailService(req.body.login,
                req.body.password,
                req.body.email,
                req.socket.remoteAddress)
        if (userRegWithMail) {
            res.sendStatus(204)
            return
        }
        else {
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
authRouter.get("/me",
    authMiddleware,
    async (req: Request, res: Response) => {
        return res.send({login: req.user?.login, email: req.user?.email, userId: req.user?.id})
    })