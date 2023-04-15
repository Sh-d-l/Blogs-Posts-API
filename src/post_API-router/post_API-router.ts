import {Request, Response, Router} from "express";
import {posts_repositories} from "../post_API-repositories/post_API-repositories-db";
import {PostType} from "../post_API-repositories/post_API-repositories-memory";
import {basicAuth} from "../auth/basic_auth"
import {createPostValidation, updatePostValidation} from "../middlewares/validators/blog-validation";

export const post_Router = Router({});

post_Router.get('/', async (req, res) => {
    const get_Post:PostType[] = await posts_repositories.getPost()
    res.status(200).send(get_Post)
})
post_Router.post('/',
    basicAuth,
    ...createPostValidation,
    async (req: Request, res: Response) => {
        const postPost: PostType | null = await posts_repositories.createPost(
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.blogId)
       if(postPost !== null) {
           res.status(201).send(postPost)
       }
    })
post_Router.get('/:id', async (req, res) => {
    const getPostId:PostType | null = await posts_repositories.getPostID(req.params.id)
    if (getPostId) {
        res.status(200).send(getPostId)
    } else {
        res.sendStatus(404)
    }
})
post_Router.put('/:id',
    basicAuth,
    ...updatePostValidation,
    async (req, res) => {
        const put_Post:boolean = await posts_repositories.updatePost(
            req.params.id,
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.blogId)
        if (put_Post) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })
post_Router.delete('/:id',
    basicAuth,
    async (req, res) => {
        const del_PostID:boolean = await posts_repositories.deleteID(req.params.id)
        if (del_PostID) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })

