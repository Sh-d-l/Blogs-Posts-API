import {Request, Response, Router} from "express";
import {TBlogDb} from "../blog_API-repositories/blog_API-repositories-memory";
import {basicAuth} from "../auth/basic_auth"
import {
    createBlogValidation, createPostByBlogIDValidation, updateBlogValidation,
} from "../middlewares/validators/blog-validation";
import {blogsService} from "../blog_API-service/blog_API-service";
import {TypeGetBlogsWithCount} from "../blog_API-repositories/blogRepositoriesQuery";
import {blogsRepoQuery} from "../blog_API-repositories/blogRepositoriesQuery";
import {TypeGetPostsByBlogId} from "../blog_API-repositories/blogRepositoriesQuery";
import {PostType} from "../post_API-repositories/post_API-repositories-memory";
import {SortDirection} from "mongodb";

export const blog_Router = Router({});

blog_Router.get('/', async (req:Request, res:Response) => {
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

blog_Router.post("/",
    basicAuth,
    ...createBlogValidation,
    async (req, res) => {
        const postBlog:TBlogDb = await blogsService
            .createBlogService(req.body.name,
                req.body.description,
                req.body.websiteUrl)
        res.status(201).send(postBlog)
    })

blog_Router.post ("/:blogId/posts",
    basicAuth,
    ...createPostByBlogIDValidation,
    async (req,res) => {
        const addPostByBlogId:PostType | null  = await  blogsService
            .createPostByBlogId (req.params.blogId, req.body.title,
            req.body.shortDescription,
            req.body.content);
        if(addPostByBlogId) {
            res.status(201).send(addPostByBlogId)
        }
        else {
            res.sendStatus(404)
        }
})

blog_Router.get('/:id', async (req, res) => {
    const getBlogId: TBlogDb | null = await blogsService
        .getBlogIDService(req.params.id)
    if (getBlogId) {
        res.status(200).send(getBlogId)
    } else {
        res.sendStatus(404)
    }
})

blog_Router.get('/:blogId/posts', async (req: Request,res: Response) => {
    const getPostsByBlogID:TypeGetPostsByBlogId | null = await blogsRepoQuery
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

blog_Router.put('/:id',
    basicAuth,
    ...updateBlogValidation,
    async (req, res) => {
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
blog_Router.delete('/:id',
    basicAuth,
    async (req, res) => {
        const delBlogID: boolean = await blogsService.deleteIDService(req.params.id)
        if (delBlogID) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })


