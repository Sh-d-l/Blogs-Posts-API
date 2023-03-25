import { Router} from "express";
import {posts_repositories} from "../post_API-repositories/post_API-repositories";
import {body} from 'express-validator';
import {inputValidator} from "../validators/validatorPost";
import {validatorAddPostByIdBlog} from "../validators/validator_existing_ID"
import {basicAuth} from "../auth/basic_auth"

export const post_Router = Router({});

post_Router.get('/', (req,res) => {
    const get_Post = posts_repositories.getPost
    res.status(200).send(get_Post())
})
post_Router.post('/',
    basicAuth,
    body('title').trim().isLength({min:1,max:30}).isString(),
    body('shortDescription').trim().isString().isLength({min:1 ,max:100}),
    body('content').trim().isString().isLength({max:1000}),
    body('blogId').isString(),
    inputValidator,
    body('blogId').custom(validatorAddPostByIdBlog),
    (req,res) => {
        const post_Post = posts_repositories.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId, req.body.blogName)
        res.status(201).send(post_Post)
    })
post_Router.get('/:id', (req,res) => {
    const get_PostId = posts_repositories.getPost_ID (req.params.id)
    if(get_PostId) {
        res.status(200).send(get_PostId)
    }
    else {
        res.sendStatus(400)
    }
})
post_Router.put ('/',
    body('title').trim().isLength({min:1,max:30}).isString(),
    body('shortDescription').trim().isString().isLength({min:1 ,max:100}),
    body('content').trim().isString().isLength({max:1000}),
    body('blogId').isString(),
    inputValidator,
    (req,res) => {
        const put_Post = posts_repositories.updatePost(req.body.id, req.body.title,req.body.shortDescription, req.body.content, req.body.blogId)
        if(put_Post) {
            res.sendStatus(204)
        }
        else {
            res.sendStatus(404)
        }
    })
post_Router.delete('/:id', (req,res) => {
    const del_PostID = posts_repositories.deleteID(req.params.id)
    if (del_PostID) {
        res.sendStatus(204)
    }
    else {
        res.sendStatus(404)
    }
})