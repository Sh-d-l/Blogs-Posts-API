import {Request, Response, Router} from "express";
import {basicAuth} from "../auth/basic_auth"
import {createNewUser} from "../middlewares/validators/validations";
import {usersService} from "../users_API-service/users_API-service";
import {usersQueryRepo} from "../users_API-repositories/usersRepositoriesQuery";
import {SortDirection} from "mongodb";
import {TypeGetUsersWithCount} from "../users_API-repositories/usersRepositoriesQuery";
import {TUsersDb} from "../users_API-repositories/usersRepositoriesQuery";

export const usersRouter = Router({});

usersRouter.get('/',
    basicAuth,
    async (req: Request, res: Response) => {
    const getUsers: TypeGetUsersWithCount = await usersQueryRepo
        .getUsersRepoQuery(
            req.query.searchLoginTerm ? String(req.query.searchLoginTerm) : null,
            req.query.searchEmailTerm ? String(req.query.searchEmailTerm) : null,
            req.query.sortBy ? String(req.query.sortBy) : "createdAt",
            req.query.sortDirection as SortDirection || "desc",
            Number(req.query.pageNumber) || 1,
            Number(req.query.pageSize) || 10,
        )
    res.status(200).send(getUsers)
})

usersRouter.post("/",
    basicAuth,
    ...createNewUser,
    async (req:Request, res:Response) => {
        const addUser: TUsersDb = await usersService
            .createUserService(req.body.login,
                req.body.password,
                req.body.email)
        res.status(201).send(addUser)
    })

usersRouter.delete ("/:id",
    basicAuth,
    async (req:Request, res:Response) => {
        const deleteUser: boolean = await usersService.deleteUserById(req.params.id)
        if (deleteUser) {
            return res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }
    )
