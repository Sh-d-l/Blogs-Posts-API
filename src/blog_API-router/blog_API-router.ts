import {Router} from "express";
import {blogs_repositories} from "../blog_API-repositories/blog_API-repositories";
import {basicAuth} from "../auth/basic_auth"
import {createBlogValidation, updateBlogValidation} from "../middlewares/validators/blog-validation";

export const blog_Router = Router({});
export const delBlog_Router = Router({});

blog_Router.get('/', (req, res) => {
    const get_Blog = blogs_repositories.getBlog
    res.status(200).send(get_Blog())
})
blog_Router.post('/',
    basicAuth,
    ...createBlogValidation,
    (req, res) => {
        const post_Blog = blogs_repositories.createBlog(req.body.name, req.body.description, req.body.websiteUrl)
        res.status(201).send(post_Blog)
    })

blog_Router.get('/:id', (req, res) => {
    const get_BlogId = blogs_repositories.getBlog_ID(req.params.id)
    if (get_BlogId) {
        res.status(200).send(get_BlogId)
    } else {
        res.sendStatus(400)
    }
})
blog_Router.put('/',
    basicAuth,
    ...updateBlogValidation,
    (req, res) => {
        const put_Blog = blogs_repositories.updateBlog(req.params.id, req.body.name, req.body.description, req.body.websiteUrl)
        if (put_Blog) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })
blog_Router.delete('/:id',
    basicAuth,
    (req, res) => {
        const del_BlogID = blogs_repositories.deleteID(req.params.id)
        if (del_BlogID) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })


