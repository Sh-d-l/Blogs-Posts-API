import {Request, Response, Router} from "express";
import {basicAuth} from "../auth/basic_auth"
import {UsersQueryRepo} from "../repositories/usersRepositoriesQuery";
import {TypeGetUsersWithCount} from "../types/types";
import {CreateObjectOfUserForClient} from "../types/types";
import {IPagination} from "../types/types";
import {superAdminUserController} from "../composition-root";
import {SuperAdminUserService} from "../service/superAdminUserService";
import {createNewUserSuperAdminValidation} from "../middlewares/validators/validations";

export const usersRouter = Router({});
export const getPaginationFromQuery = (query: any): IPagination => {
    const pageNumber = Number(query.pageNumber)
    const pageSize = Number(query.pageSize)
    return {
        searchLoginTerm: query.searchLoginTerm ?? '',
        searchEmailTerm: query.searchEmailTerm ?? '',
        searchNameTerm: query.searchNameTerm ?? '',
        sortBy: query.sortBy ?? "createdAt",
        sortDirection: query.sortDirection === 'asc' ? 'asc' : "desc",
        pageNumber: pageNumber > 0 ? pageNumber : 1 || 1,
        pageSize: pageSize > 0 ? pageSize : 10 || 10,
        skip: (pageNumber - 1) * pageSize
    }
}

export class SuperAdminUserController {
    constructor(protected superAdminUserService:SuperAdminUserService,
    protected usersQueryRepo:UsersQueryRepo) {
    }
    async getAllUser(req: Request, res: Response){
        const pagination = getPaginationFromQuery(req.query)
        const getUsers: TypeGetUsersWithCount = await this.usersQueryRepo.getUsersRepoQuery(pagination)
        res.status(200).send(getUsers)
    }
    async createSuperAdminUser(req: Request, res: Response){
        const addUser: CreateObjectOfUserForClient = await this.superAdminUserService
            .createUserSuperAdminService(req.body.login,
                req.body.password,
                req.body.email)
        res.status(201).send(addUser)
    }
    async deleteUser(req: Request, res: Response){
        const deleteUser: boolean =
            await this.superAdminUserService.deleteUserById(req.params._id)
        if (deleteUser) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }
}

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
