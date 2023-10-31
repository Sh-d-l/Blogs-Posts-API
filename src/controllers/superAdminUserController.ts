import {basicAuth} from "../auth/basic_auth";
import {superAdminUserController} from "../composition-root";
import {createNewUserSuperAdminValidation} from "../middlewares/validators/validations";
import {Router} from "express";
import {usersRouter} from "../routers/users_API-router";

usersRouter.get('/',
    basicAuth,
    superAdminUserController.getAllUser.bind(superAdminUserController) )

usersRouter.post("/",
    basicAuth,
    ...createNewUserSuperAdminValidation,
    superAdminUserController.createSuperAdminUser.bind(superAdminUserController) )

usersRouter.delete("/:id",
    basicAuth,
    superAdminUserController.deleteUser.bind(superAdminUserController)
)