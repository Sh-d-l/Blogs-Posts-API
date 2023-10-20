import {Request, Response, Router} from "express";
import {TBlogDb} from "../types/types";

import {
    createBlogValidation, createPostByBlogIDValidation, updateBlogValidation,
} from "../middlewares/validators/validations";
import {blogsService} from "../service/blog_API-service";
import {TypeGetBlogsWithCount} from "../types/types";
import {blogsRepoQuery} from "../repositories/blogRepositoriesQuery";
import {TypeGetPostsByBlogId} from "../types/types";
import {PostType} from "../types/types";
import {SortDirection} from "mongodb";
import {authMiddleware} from "../middlewares/authMiddleware";
import {basicAuth} from "../auth/basic_auth";

export const blogRouter = Router({});

class BlogsController {
    async getAllBlogs(req: Request, res: Response){
        const getBlogs: TypeGetBlogsWithCount = await blogsRepoQuery
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
        const postBlog: TBlogDb = await blogsService
            .createBlogService(req.body.name,
                req.body.description,
                req.body.websiteUrl)
        res.status(201).send(postBlog)
    }
    async createPostByBlogId(req:Request, res:Response){
        const addPostByBlogId: PostType | null = await blogsService
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
        const getBlogId: TBlogDb | null = await blogsService
            .getBlogIDService(req.params.id)
        if (getBlogId) {
            res.status(200).send(getBlogId)
        } else {
            res.sendStatus(404)
        }
    }
    async getPostsByBlogId(req:Request, res:Response){
        const getPostsByBlogID: TypeGetPostsByBlogId | null = await blogsRepoQuery
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
        const putBlog: boolean = await blogsService.updateBlogService(
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
export const blogsController = new BlogsController()

blogRouter.get('/', blogsController.getAllBlogs)

blogRouter.post("/",
    //authMiddleware,
    basicAuth,
    ...createBlogValidation,
    blogsController.createBlog)

blogRouter.post("/:blogId/posts",
    //authMiddleware,
    basicAuth,
    ...createPostByBlogIDValidation,
    blogsController.createPostByBlogId)

blogRouter.get('/:id', blogsController.getBlogById)

blogRouter.get('/:blogId/posts', blogsController.getPostsByBlogId)

blogRouter.put('/:id',
    //authMiddleware,
    basicAuth,
    ...updateBlogValidation,
    blogsController.updateBlog
   )


