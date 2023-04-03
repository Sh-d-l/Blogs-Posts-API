import {Request, Response, Router} from "express";
import {posts_repositories} from "../post_API-repositories/post_API-repositories";
import {basicAuth} from "../auth/basic_auth"
import {createPostValidation, updatePostValidation} from "../middlewares/validators/blog-validation";

export const post_Router = Router({});

post_Router.get('/', (req, res) => {
    const get_Post = posts_repositories.getPost
    res.status(200).send(get_Post())
})
post_Router.post('/',
    basicAuth,
    ...createPostValidation,
    (req: Request, res: Response) => {
        const post_Post = posts_repositories.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
        res.status(201).send(post_Post)
    })
post_Router.get('/:id', (req, res) => {
    const get_PostId = posts_repositories.getPost_ID(req.params.id)
    if (get_PostId) {
        res.status(200).send(get_PostId)
    } else {
        res.sendStatus(404)
    }
})
post_Router.put('/:id',
    basicAuth,
    ...updatePostValidation,
    (req, res) => {
        const put_Post = posts_repositories.updatePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
        if (put_Post) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })
post_Router.delete('/:id',
    basicAuth,
    (req, res) => {
        const del_PostID = posts_repositories.deleteID(req.params.id)
        if (del_PostID) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })

