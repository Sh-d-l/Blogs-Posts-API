import { Router} from "express";
import {blogs_repositories} from "../blog_API-repositories/blog_API-repositories";
import {body} from 'express-validator';
import {inputValidator} from "../validators/validatorPost";
import {basicAuth} from "../auth/basic_auth"

export const blog_Router = Router({});

blog_Router.get('/', (req,res) => {
    const get_Blog = blogs_repositories.getBlog
    res.status(200).send(get_Blog())
})
blog_Router.post('/',
    basicAuth,
    body('name').trim().isLength({min:1,max:15}).isString(),
    body('description').trim().isString().isLength({min:1 ,max:500}),
    body('websiteUrl').trim().isString().isLength({max:100}),
    inputValidator,
    (req,res) => {
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
blog_Router.put('/',
    body('name').trim().isLength({min:1,max:15}).isString(),
    body('description').trim().isString().isLength({min:1 ,max:500}),
    body('websiteUrl').trim().isString().isLength({max:100}),
    inputValidator,
    (req,res) => {
    const put_Blog = blogs_repositories.updateBlog(req.body.id, req.body.name,req.body.description, req.body.websiteUrl)
    if(put_Blog) {
        res.sendStatus(204)
    }
    else {
        res.sendStatus(404)
    }
    })
blog_Router.delete('/:id', (req,res) => {
    const del_BlogID = blogs_repositories.deleteID(req.params.id)
    if (del_BlogID) {
        res.sendStatus(204)
    }
    else {
        res.sendStatus(404)
    }
})
