import {customRateLimitMiddleware} from "../middlewares/customRateLimitMiddleware";
import {container} from "../composition-root";
import {
    confirmCodeValidation,
    createNewUserValidation,
    mailValidation,
    newPasswordValidationArray, resendingEmailValidation
} from "../middlewares/validators/validations";
import {Router} from "express";
export const authRouter = Router({})
import {authMiddleware} from "../middlewares/authMiddleware";
import {AuthController} from "../routers/authRouter";

const authController = container.resolve(AuthController)

authRouter.post("/login",
    customRateLimitMiddleware,
    authController.login.bind(authController))

authRouter.post("/password-recovery",
    customRateLimitMiddleware,
    ...mailValidation,
    authController.passwordRecovery.bind(authController))

authRouter.post("/new-password",
    customRateLimitMiddleware,
    ...newPasswordValidationArray,
    authController.newPassword.bind(authController))

authRouter.post("/refresh-token",
    authController.refreshToken.bind(authController))

authRouter.post("/registration",
    customRateLimitMiddleware,
    ...createNewUserValidation,
    authController.createUserWithConfirmationCode.bind(authController))

authRouter.post("/registration-confirmation",
    customRateLimitMiddleware,
    ...confirmCodeValidation,
    authController.registrationConfirmation.bind(authController)
)
authRouter.post("/registration-email-resending",
    customRateLimitMiddleware,
    ...resendingEmailValidation,
    authController.resendingEmailWithConfirmationCode.bind(authController)
)
authRouter.post("/logout",
    authController.logout.bind(authController)
)
authRouter.get("/me",
    authMiddleware,
    authController.getInformationAboutCurrentUser.bind(authController))