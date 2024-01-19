import {basicAuth} from "../auth/basic_auth";
import {container} from "../composition-root";
import {createNewUserSuperAdminValidation} from "../middlewares/validators/validations";
import {Router} from "express";
import {SuperAdminUserController} from "../routers/users_API-router";
export const usersRouter = Router({});
const superAdminUserController = container.resolve(SuperAdminUserController)
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