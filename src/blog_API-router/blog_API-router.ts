import {Router} from "express";
import {blogs_repositories} from "../blog_API-repositories/blog_API-repositories-db";
import {BlogType} from "../blog_API-repositories/blog_API-repositories-memory";
import {basicAuth} from "../auth/basic_auth"
import {createBlogValidation, updateBlogValidation} from "../middlewares/validators/blog-validation";

export const blog_Router = Router({});

blog_Router.get('/', async (req, res) => {
    const get_Blogs:BlogType[] = await blogs_repositories.getBlogs()
    res.status(200).send(get_Blogs)
})
blog_Router.post("/",
    basicAuth,
    ...createBlogValidation,
    async (req, res) => {
        const post_Blog = await blogs_repositories
            .createBlog(req.body.name, req.body.description, req.body.websiteUrl)
        res.status(201).send(post_Blog)
    })

blog_Router.get('/:id', async (req, res) => {
    const get_BlogId:BlogType | null = await blogs_repositories.getBlog_ID(req.params.id)
    if (get_BlogId) {
        res.status(200).send(get_BlogId)
    } else {
        res.sendStatus(404)
    }
})
blog_Router.put('/:id',
    basicAuth,
    ...updateBlogValidation,
    async (req, res) => {
        const put_Blog:boolean = await blogs_repositories.updateBlog(
            req.params.id,
            req.body.name,
            req.body.description,
            req.body.websiteUrl
        )
        if (put_Blog) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })
blog_Router.delete('/:id',
    basicAuth,
    async (req, res) => {
        const del_BlogID:boolean = await blogs_repositories.deleteID(req.params.id)
        if (del_BlogID) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })


