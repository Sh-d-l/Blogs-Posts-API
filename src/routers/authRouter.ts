import {Request, Response, Router} from "express";
import {CreateObjectOfUserForClient} from "../types/types";
import {authMiddleware} from "../middlewares/authMiddleware";
import {
    confirmCodeValidation, createNewUserValidation, mailValidation, newPasswordValidationArray,
    resendingEmailValidation,
} from "../middlewares/validators/validations";
import {CreateUserService} from "../service/userService";
import {customRateLimitMiddleware} from "../middlewares/customRateLimitMiddleware";
import {authController} from "../composition-root";
export const authRouter = Router({})

export class AuthController {
    constructor(protected userService:CreateUserService) {
    }
    async login (req: Request, res: Response) {
        const authUser = await this.userService
            .authUserWithEmailService(req.body.loginOrEmail, req.body.password,req.ip,req.headers["user-agent"])
        if (authUser) {
            res.cookie('refreshToken', authUser[1], {httpOnly: true, secure: true,})
                .status(200)
                .send({"accessToken":authUser[0]})
        } else {
            res.sendStatus(401)
        }
    }
    async passwordRecovery(req: Request, res: Response){
        const passwordRecoveryBoolean = await this.userService.passwordRecoveryService(req.body.email)
        if (passwordRecoveryBoolean) {
            res.sendStatus(204)
            return
        }
    }
    async newPassword(req: Request, res: Response){
        const passwordChanged = await  this.userService.changePasswordOfUser(req.body.newPassword, req.body.recoveryCode)
        if(passwordChanged)  res.sendStatus(204)
        else res.sendStatus(400)
    }
    async refreshToken(req: Request, res: Response){
        const tokensArray = await this.userService.refreshingTokensService(req.cookies.refreshToken)
        if (tokensArray) {
            res.status(200)
                .cookie('refreshToken', tokensArray[1], {httpOnly: true, secure: true,})
                .send({accessToken: tokensArray[0]})
        } else {
            res.sendStatus(401)
        }
    }
    async createUserWithConfirmationCode(req: Request, res: Response){
        const userRegWithMail: CreateObjectOfUserForClient | null = await this.userService
            .createUserWithEmailService(req.body.login,
                req.body.password,
                req.body.email)
        if (userRegWithMail) {
            res.sendStatus(204)
            return
        } else {
            res.sendStatus(400)
        }
    }
    async registrationConfirmation(req: Request, res: Response){
        const updateIsConfirmed = await this.userService.confirmationCodeService(req.body.code)
        if (updateIsConfirmed) {
            res.sendStatus(204)
            return
        }
    }
    async resendingEmailWithConfirmationCode(req: Request, res: Response){
        const resendingEmail = await this.userService.resendingEmailService(req.body.email)
        if (resendingEmail) {
            res.sendStatus(204)
            return
        }
    }
    async logout (req: Request, res: Response) {
        const correctRefreshToken: boolean = await this.userService.logoutService(req.cookies.refreshToken)
        if(correctRefreshToken) {
            res.cookie(req.cookies.refreshToken, "", {maxAge: 0}).status(204).send()
        }
        else {
            res.sendStatus(401)
        }
    }
    async getInformationAboutCurrentUser(req: Request, res: Response){
        return res.send({login: req.user?.login, email: req.user?.email, userId: req.user?.id})
    }
}



