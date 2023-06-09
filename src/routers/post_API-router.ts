import {Request, Response, Router} from "express";
import {PostType} from "../types/types";
import {CommentType} from "../types/types";
import {basicAuth} from "../auth/basic_auth"
import {
    createCommentValidation,
    createPostValidation,
    updatePostValidation
} from "../middlewares/validators/validations";
import {authMiddleware} from "../middlewares/authMiddleware";
import {postService} from "../service/post_API-service";
import {postsRepoQuery} from "../repositories/postRepositoriesQuery";
import {SortDirection} from "mongodb";
import {TypeGetCommentsByPostId} from "../types/types";

export const postRouter = Router({});

postRouter.get('/', async (req: Request, res: Response) => {
    const getPosts = await postsRepoQuery.getPostsRepoQuery(
        req.query.sortBy ? String(req.query.sortBy) : "createdAt",
        req.query.sortDirection as SortDirection || "desc",
        Number(req.query.pageNumber) || 1,
        Number(req.query.pageSize) || 10,)
    res.status(200).send(getPosts)
})
postRouter.post('/',
    basicAuth,
    ...createPostValidation,
    async (req: Request, res: Response) => {
        const postPost: PostType | null = await postService.createPostService(
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.blogId)
        if (postPost !== null) {
            res.status(201).send(postPost)
        }
    })

/*-------------------------create comment by postId------------------------*/

postRouter.post('/:postId/comments',
    authMiddleware,
    ...createCommentValidation,
    async (req: Request, res: Response) => {
        const getPostId: PostType | null = await postService
            .getPostIDService(req.params.postId)
        if (getPostId) {
            const newComment: CommentType = await postService
                .createCommentService(req.body.content,req.params.postId, req.user!)
            res.status(201).send(newComment)
        } else {
            res.sendStatus(404)
        }
    }
)

/*------------------------get comments by PostID---------------------------*/

postRouter.get('/:postId/comments', async (req: Request, res: Response) => {
        const getCommentsByPostId: TypeGetCommentsByPostId | null = await postsRepoQuery.getCommentsRepoQuery(
            req.params.postId,
            req.query.sortBy ? String(req.query.sortBy) : "createdAt",
            req.query.sortDirection as SortDirection || "desc",
            Number(req.query.pageNumber) || 1,
            Number(req.query.pageSize) || 10,)
    if(getCommentsByPostId) {
        res.status(200).send(getCommentsByPostId)
    } else {
        res.sendStatus(404)
    }
})

/*-------------------------------------------------------------------------*/

postRouter.get('/:id', async (req: Request, res: Response) => {
    const getPostId: PostType | null = await postService.getPostIDService(req.params.id)
    if (getPostId) {
        res.status(200).send(getPostId)
    } else {
        res.sendStatus(404)
    }
})
postRouter.put('/:id',
    basicAuth,
    ...updatePostValidation,
    async (req: Request, res: Response) => {
        const putPost: boolean = await postService.updatePostService(
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
postRouter.delete('/:id',
    basicAuth,
    async (req, res) => {
        const delPostID: boolean = await postService.deleteIDService(req.params.id)
        if (delPostID) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })

