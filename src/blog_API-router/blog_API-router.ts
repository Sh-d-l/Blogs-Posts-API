import {Router} from "express";
import {blogs_repositories} from "../blog_API-repositories/blog_API-repositories-db";
import {TBlogDb} from "../blog_API-repositories/blog_API-repositories-memory";
import {basicAuth} from "../auth/basic_auth"
import {createBlogValidation, updateBlogValidation} from "../middlewares/validators/blog-validation";

export const blog_Router = Router({});

blog_Router.get('/', async (req, res) => {
    const get_Blogs: TBlogDb[] = await blogs_repositories.getBlogs()
    res.status(200).send(get_Blogs)
})
blog_Router.post("/",
    basicAuth,
    ...createBlogValidation,
    async (req, res) => {
        const postBlog = await blogs_repositories
            .createBlog(req.body.name, req.body.description, req.body.websiteUrl)
        res.status(201).send(postBlog)
    })

blog_Router.get('/:id', async (req, res) => {
    const getBlogId: TBlogDb | null = await blogs_repositories.getBlogID(req.params.id)
    if (getBlogId) {
        res.status(200).send(getBlogId)
    } else {
        res.sendStatus(404)
    }
})
blog_Router.put('/:id',
    basicAuth,
    ...updateBlogValidation,
    async (req, res) => {
        const putBlog: boolean = await blogs_repositories.updateBlog(
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
        const delBlogID: boolean = await blogs_repositories.deleteID(req.params.id)
        if (delBlogID) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })


