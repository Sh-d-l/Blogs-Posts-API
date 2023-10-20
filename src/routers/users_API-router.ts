import {Request, Response, Router} from "express";
import {basicAuth} from "../auth/basic_auth"
import {usersQueryRepo} from "../repositories/usersRepositoriesQuery";
import {TypeGetUsersWithCount} from "../types/types";
import {CreateObjectOfUserForClient} from "../types/types";
import {IPagination} from "../types/types";
import {createUserService} from "../service/userService";

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

usersRouter.get('/',
    basicAuth,
    async (req: Request, res: Response) => {
        const pagination = getPaginationFromQuery(req.query)
        const getUsers: TypeGetUsersWithCount = await usersQueryRepo.getUsersRepoQuery(pagination)
        res.status(200).send(getUsers)
    })

usersRouter.post("/",
    basicAuth,
    //...createNewUserSuperAdminValidation,
    async (req: Request, res: Response) => {
        const addUser: CreateObjectOfUserForClient = await createUserService
            .createUserSuperAdminService(req.body.login,
                req.body.password,
                req.body.email)
        res.status(201).send(addUser)
    })

usersRouter.delete("/:id",
    basicAuth,
    async (req: Request, res: Response) => {
        const deleteUser: boolean =
            await createUserService.deleteUserById(req.params._id)
        if (deleteUser) {
            res.sendStatus(204)
        } else {
             res.sendStatus(404)
        }
    }
)
