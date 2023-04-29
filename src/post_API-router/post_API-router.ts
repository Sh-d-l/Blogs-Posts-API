import {Request, Response, Router} from "express";
import {PostType} from "../post_API-repositories/post_API-repositories-memory";
import {basicAuth} from "../auth/basic_auth"
import {createPostValidation, updatePostValidation} from "../middlewares/validators/blog-validation";
import {postService} from "../Post_API-service/post_API-service";
import {postsRepoQuery} from "../post_API-repositories/postRepositoriesQuery";
import {TypeGetPosts} from "../post_API-repositories/postRepositoriesQuery";
import {SortDirection} from "mongodb";

export const post_Router = Router({});

post_Router.get('/', async (req:Request, res:Response) => {
    const getPosts:TypeGetPosts[] = await postsRepoQuery.getPostsRepoQuery(
        String(req.query.sortBy) || "createdAt",
        req.query.sortDirection as SortDirection|| "desc",
        Number(req.query.pageNumber) || 1,
        Number(req.query.pageSize) || 10,)
    //console.log(...getPosts, "router")
    res.status(200).send(getPosts)
})
post_Router.post('/',
    basicAuth,
    ...createPostValidation,
    async (req: Request, res: Response) => {
        const postPost: PostType | null = await postService.createPostService(
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.blogId)
       if(postPost !== null) {
           res.status(201).send(postPost)
       }
    })
post_Router.get('/:id', async (req, res) => {
    const getPostId:PostType | null = await postService.getPostIDService(req.params.id)
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
        const putPost:boolean = await postService.updatePostService(
            req.params.id,
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.blogId)
        if (putPost) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })
post_Router.delete('/:id',
    basicAuth,
    async (req, res) => {
        const delPostID:boolean = await postService.deleteIDService(req.params.id)
        if (delPostID) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })

