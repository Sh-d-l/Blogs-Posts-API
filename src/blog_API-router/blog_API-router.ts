import {Router} from "express";
import {blogs_repositories} from "../blog_API-repositories/blog_API-repositories";
export const blog_Router = Router({});

blog_Router.get('/', (req,res) => {
    const get_Blog = blogs_repositories.getBlog
    res.status(200).send(get_Blog())
})
blog_Router.post('/',(req,res) => {
    const post_Blog = blogs_repositories.createBlog(req.body.name,req.body.description,req.body.websiteUrl)
    res.status(201).send(post_Blog)
})
blog_Router.get('/:id', (req,res) => {
    const get_BlogId = blogs_repositories.getBlog_ID (req.params.id)
    if(get_BlogId) {
        res.status(200).send(get_BlogId)
    }
    else {
        res.sendStatus(400)
    }
})
