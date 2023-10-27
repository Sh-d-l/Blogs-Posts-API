import {Request, Response, Router} from "express";
import {TBlogDb} from "../types/types";

import {
    createBlogValidation, createPostByBlogIDValidation, updateBlogValidation,
} from "../middlewares/validators/validations";
import {TypeGetBlogsWithCount} from "../types/types";
import {BlogsRepoQuery} from "../repositories/blogRepositoriesQuery";
import {TypeGetPostsByBlogId} from "../types/types";
import {PostType} from "../types/types";
import {SortDirection} from "mongodb";
import {basicAuth} from "../auth/basic_auth";
import {BlogsService} from "../service/blog_API-service";
import {blogsService, blogsRepoQuery, blogsController} from "../composition-root";

export const blogRouter = Router({});

export class BlogsController {
    constructor(protected  blogsService:BlogsService,
    protected  blogsRepoQuery:BlogsRepoQuery) {
    }
    async getAllBlogs(req: Request, res: Response){
        const getBlogs: TypeGetBlogsWithCount = await this.blogsRepoQuery
            .getBlogsRepoQuery(
                req.query.searchNameTerm ? String(req.query.searchNameTerm) : null,
                req.query.sortBy ? String(req.query.sortBy) : "createdAt",
                req.query.sortDirection as SortDirection || "desc",
                Number(req.query.pageNumber) || 1,
                Number(req.query.pageSize) || 10,
            )
        res.status(200).send(getBlogs)
    }
    async createBlog(req:Request, res:Response){
        const postBlog: TBlogDb = await this.blogsService
            .createBlogService(req.body.name,
                req.body.description,
                req.body.websiteUrl)
        res.status(201).send(postBlog)
    }
    async createPostByBlogId(req:Request, res:Response){
        const addPostByBlogId: PostType | null = await this.blogsService
            .createPostByBlogId(req.params.blogId, req.body.title,
                req.body.shortDescription,
                req.body.content);
        if (addPostByBlogId) {
            res.status(201).send(addPostByBlogId)
        } else {
            res.sendStatus(404)
        }
    }
    async getBlogById(req:Request, res:Response){
        const getBlogId: TBlogDb | null = await this.blogsService
            .getBlogIDService(req.params.id)
        if (getBlogId) {
            res.status(200).send(getBlogId)
        } else {
            res.sendStatus(404)
        }
    }
    async getPostsByBlogId(req:Request, res:Response){
        const getPostsByBlogID: TypeGetPostsByBlogId | null = await this.blogsRepoQuery
            .getAllPostsByBlogId(
                req.params.blogId,
                req.query.sortBy ? String(req.query.sortBy) : "createdAt",
                req.query.sortDirection as SortDirection || "desc",
                Number(req.query.pageNumber) || 1,
                Number(req.query.pageSize) || 10,)

        if (getPostsByBlogID) {
            res.status(200).send(getPostsByBlogID)
        } else {
            res.sendStatus(404)
        }
    }
    async updateBlog(req:Request, res:Response){
        const putBlog: boolean = await this.blogsService.updateBlogService(
            req.params.id,
            req.body.name,
            req.body.description,
            req.body.websiteUrl
        )
        if (putBlog) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }

}

blogRouter.get('/', blogsController.getAllBlogs.bind(blogsController))

blogRouter.post("/",
    //authMiddleware,
    basicAuth,
    ...createBlogValidation,
    blogsController.createBlog.bind(blogsController))

blogRouter.post("/:blogId/posts",
    //authMiddleware,
    basicAuth,
    ...createPostByBlogIDValidation,
    blogsController.createPostByBlogId.bind(blogsController))

blogRouter.get('/:id', blogsController.getBlogById.bind(blogsController))

blogRouter.get('/:blogId/posts', blogsController.getPostsByBlogId.bind(blogsController))

blogRouter.put('/:id',
    //authMiddleware,
    basicAuth,
    ...updateBlogValidation,
    blogsController.updateBlog.bind(blogsController)
   )


