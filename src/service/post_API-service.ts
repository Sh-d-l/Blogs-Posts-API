import {TBlogDb} from "../types/types";
import {CommentType, CommentTypeWithPostId} from "../types/types";
import {randomUUID} from "crypto";
import {PostType} from "../types/types";
import {PostsRepo} from "../repositories/post_API-repositories-db";
import {CreateObjectOfUserForClient} from "../types/types";
import {BlogsRepo} from "../repositories/blog_API-repositories-db";
import "reflect-metadata";
import {injectable} from "inversify";
@injectable()

export class PostService {
    constructor( protected blogsRepo:BlogsRepo,
                 protected postsRepo:PostsRepo) {
    }
    async createPostService(title: string,
                            shortDescription: string,
                            content: string,
                            blogId: string): Promise<PostType | null> {
        const blog: TBlogDb | null = await this.blogsRepo.getBlogID(blogId)
        if (!blog) return null
        const newPost = new PostType(
            randomUUID(),
            title,
            shortDescription,
            content,
            blog.id,
            blog.name,
            new Date().toISOString(),
        )
        // const newPost: PostType = {
        //     id: randomUUID(),
        //     title,
        //     shortDescription,
        //     content,
        //     blogId: blog.id,
        //     blogName: blog.name,
        //     createdAt: new Date().toISOString(),
        // }
        await this.postsRepo.createPost(newPost);
        return newPost;
    }

      /*----------------------create comment------------------------*/

    async createCommentService(content: string,postId:string, user:CreateObjectOfUserForClient):Promise<CommentType> {
        // const newComment:CommentType = {
        //     id: randomUUID(),
        //     content,
        //     commentatorInfo: {
        //         userId: user.id,
        //         userLogin: user.login,
        //     },
        //     createdAt: new Date().toISOString(),
        // }
        const newCommentWithPostId = new CommentTypeWithPostId(
            postId,
            randomUUID(),
            content,
            {
                userId: user.id,
                userLogin: user.login,
            },
            new Date().toISOString(),
            {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: "None",
            }
        )
        // const newCommentWithPostId: CommentTypeWithPostId = {
        //     postId,
        //     ...newComment,
        // }
        await this.postsRepo.createCommentByPostId(newCommentWithPostId)
       return new CommentType(
            newCommentWithPostId.id,
            newCommentWithPostId.content,
            newCommentWithPostId.commentatorInfo,
            newCommentWithPostId.createdAt,
            newCommentWithPostId.likesInfo

        )
    }

    /*------------------------------------------------------------*/

    async getPostIDService(id: string): Promise<PostType | null> {
         return await this.postsRepo.getPostID(id);



    }

    async updatePostService(id: string,
                     title: string,
                     shortDescription: string,
                     content: string,
                     blogId: string,): Promise<boolean> {
        return await this.postsRepo.updatePost(id,title,shortDescription,content,blogId)
    }

    async deleteIDService(id: string): Promise<boolean> {
        return await this.postsRepo.deleteID(id)
    }
}


