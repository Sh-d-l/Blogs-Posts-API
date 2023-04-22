import {Router} from "express";
import {blogs_repositories} from "../blog_API-repositories/blog_API-repositories-db";
import {TBlogDb} from "../blog_API-repositories/blog_API-repositories-memory";
import {basicAuth} from "../auth/basic_auth"
import {createBlogValidation, updateBlogValidation} from "../middlewares/validators/blog-validation";
import {blogsService} from "../blog_API-service/blog_API-service";
import {TypeGetBlogs} from "../blog_API-repositories/blogRepositoriesQuery";
import {blogsRepoQuery} from "../blog_API-repositories/blogRepositoriesQuery";
import {TypeGetPostsByBlogId} from "../blog_API-repositories/blogRepositoriesQuery";
import {PostType} from "../post_API-repositories/post_API-repositories-memory";

export const blog_Router = Router({});

blog_Router.get('/', async (req, res) => {
    const get_Blogs: TypeGetBlogs[] = await blogsRepoQuery.getBlogsRepoQuery()
    res.status(200).send(get_Blogs)
})
blog_Router.post("/",
    basicAuth,
    ...createBlogValidation,
    async (req, res) => {
        const postBlog:TBlogDb = await blogsService
            .createBlogService(req.body.name, req.body.description, req.body.websiteUrl)
        res.status(201).send(postBlog)
    })

blog_Router.post ("/:blogId/posts",
    basicAuth,
    ...createBlogValidation,
    async (req,res) => {
        const addPostByBlogId:Promise<PostType> | null = await  blogsService
            .createPostByBlogId (req.params.id, req.body.title,
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
    const getBlogId: TBlogDb | null = await blogsService.getBlogIDService(req.params.id)
    if (getBlogId) {
        res.status(200).send(getBlogId)
    } else {
        res.sendStatus(404)
    }
})

blog_Router.get('/:blogId/posts', async (req,res) => {
    const getPostsByBlogID:TypeGetPostsByBlogId[] | null = await blogsRepoQuery.getAllPostsByBlogId(req.params.blogId)
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


