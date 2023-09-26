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

export const blogRouter = Router({});

blogRouter.get('/', async (req: Request, res: Response) => {
    const getBlogs: TypeGetBlogsWithCount = await blogsRepoQuery
        .getBlogsRepoQuery(
             req.query.searchNameTerm ? String(req.query.searchNameTerm) : null,
             req.query.sortBy ? String(req.query.sortBy) : "createdAt",
             req.query.sortDirection as SortDirection || "desc",
             Number(req.query.pageNumber) || 1,
             Number(req.query.pageSize) || 10,
        )
    res.status(200).send(getBlogs)
})

blogRouter.post("/",
    authMiddleware,
    //basicAuth,
    ...createBlogValidation,
    async (req:Request, res:Response) => {
        const postBlog: TBlogDb = await blogsService
            .createBlogService(req.body.name,
                req.body.description,
                req.body.websiteUrl)
        res.status(201).send(postBlog)
    })

blogRouter.post("/:blogId/posts",
    authMiddleware,
    //basicAuth,
    ...createPostByBlogIDValidation,
    async (req:Request, res:Response) => {
        const addPostByBlogId: PostType | null = await blogsService
            .createPostByBlogId(req.params.blogId, req.body.title,
                req.body.shortDescription,
                req.body.content);
        if (addPostByBlogId) {
            res.status(201).send(addPostByBlogId)
        } else {
            res.sendStatus(404)
        }
    })

blogRouter.get('/:id', async (req, res) => {
    const getBlogId: TBlogDb | null = await blogsService
        .getBlogIDService(req.params.id)
    if (getBlogId) {
        res.status(200).send(getBlogId)
    } else {
        res.sendStatus(404)
    }
})

blogRouter.get('/:blogId/posts', async (req: Request, res: Response) => {
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
})

blogRouter.put('/:id',
    authMiddleware,
    //basicAuth,
    ...updateBlogValidation,
    async (req:Request, res:Response) => {
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
    })
blogRouter.delete('/:id',
    authMiddleware,
    //basicAuth,
    async (req, res) => {
        const delBlogID: boolean = await blogsService.deleteIDService(req.params.id)
        if (delBlogID) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })


