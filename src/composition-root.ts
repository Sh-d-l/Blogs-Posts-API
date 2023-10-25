import {CreateUserService} from "./service/userService";
import {UsersRepoDb} from "./repositories/users_API-repositories-db";
import {SecurityDevicesRepo} from "./repositories/securityDevicesRepo";
import {AuthController} from "./routers/authRouter";
import {SuperAdminUserController} from "./routers/users_API-router";
import {UsersQueryRepo} from "./repositories/usersRepositoriesQuery";
import {SuperAdminUserService} from "./service/superAdminUserService";
export const usersRepo = new UsersRepoDb()
export const securityDevicesRepo = new SecurityDevicesRepo()
export const userService = new CreateUserService(usersRepo,securityDevicesRepo)
export const authController = new AuthController(userService)
export const superAdminUserService = new SuperAdminUserService(usersRepo)
export const usersQueryRepo = new UsersQueryRepo();
export const superAdminUserController = new SuperAdminUserController(superAdminUserService,usersQueryRepo)