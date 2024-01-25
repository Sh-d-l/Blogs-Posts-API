import {Request, Response} from "express";
import {PostTypeWithoutLikes} from "../types/types";
import {CommentType} from "../types/types";
import {SortDirection} from "mongodb";
import {TypeGetCommentsByPostId} from "../types/types";
import {PostService} from "../service/post_API-service";
import {PostsRepoQuery} from "../repositories/postRepositoriesQuery";
import {injectable} from "inversify";
import "reflect-metadata";
@injectable()
export class PostsController{
    constructor(protected postService:PostService,
    protected postsRepoQuery:PostsRepoQuery) {
    }
    async makeLikeOfPost (req: Request, res: Response){
        const makeLikeOfPost = await  this.postService.likeStatusOfPostService(req.params.postId, req.body.likeStatus, req.headers.authorization)
        if (makeLikeOfPost) {
            res.sendStatus(204)
        }
        else {
            res.sendStatus(404)
        }
    }

    async getAllPosts(req: Request, res: Response){
        const getPosts = await this.postsRepoQuery.getPostsRepoQuery(
            req.query.sortBy ? String(req.query.sortBy) : "createdAt",
            req.query.sortDirection as SortDirection || "desc",
            Number(req.query.pageNumber) || 1,
            Number(req.query.pageSize) || 10,)
        res.status(200).send(getPosts)
    }

    async createPost(req: Request, res: Response){
        const postPost: PostTypeWithoutLikes | null = await this.postService.createPostService(
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.blogId)
        if (postPost) {
            res.status(201).send(postPost)
        }
    }
    async createCommentByPostId(req: Request, res: Response){
        const getPostId: PostTypeWithoutLikes | null = await this.postService
            .getPostIDService(req.params.postId)
        if (getPostId) {
            const newComment: CommentType = await this.postService
                .createCommentService(req.body.content,req.params.postId, req.user!)
            res.status(201).send(newComment)
        } else {
            res.sendStatus(404)
        }
    }
    async getCommentsByPostId(req: Request, res: Response){
        const getCommentsByPostId: TypeGetCommentsByPostId | null = await this.postsRepoQuery.getCommentsRepoQuery(
            req.params.postId,req.headers.authorization,
            req.query.sortBy ? String(req.query.sortBy) : "createdAt",
            req.query.sortDirection as SortDirection || "desc",
            Number(req.query.pageNumber) || 1,
            Number(req.query.pageSize) || 10,)
        if(getCommentsByPostId) {
            res.status(200).send(getCommentsByPostId)
        } else {
            res.sendStatus(404)
        }
    }
    async updateComment(req: Request, res: Response){
        const putPost: boolean = await this.postService.updatePostService(
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
    }
    async returnPostById(req: Request, res: Response){
        const postById = await this.postService.getPostIDService(req.params.id)
        if(postById) {
            res.status(200).send(postById)
        }
        else res.status(404)

    }
    async deletePostById(req: Request, res: Response){
        const delPostID: boolean = await this.postService.deleteIDService(req.params.id)
        if (delPostID) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }
}




