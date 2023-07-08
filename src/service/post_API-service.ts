import {TBlogDb} from "../types/types";
import {CommentType, CommentTypeWithPostId} from "../types/types";
import {randomUUID} from "crypto";
import {PostType} from "../types/types";
import {posts_repositories} from "../repositories/post_API-repositories-db";
import {TUsersDb} from "../types/types";
import {blogs_repositories} from "../repositories/blog_API-repositories-db";

export const postService = {
    async createPostService(title: string,
                            shortDescription: string,
                            content: string,
                            blogId: string): Promise<PostType | null> {
        const blog: TBlogDb | null = await blogs_repositories.getBlogID(blogId)
        if (!blog) return null
        const newPost: PostType = {
            id: randomUUID(),
            title,
            shortDescription,
            content,
            blogId: blog.id,
            blogName: blog.name,
            createdAt: new Date().toISOString(),
        }
        await posts_repositories.createPost(newPost);
        return newPost;
    },

      /*----------------------create comment------------------------*/

    async createCommentService(content: string,postId:string, user:TUsersDb):Promise<CommentType> {
        const newComment:CommentType = {
            id: randomUUID(),
            content,
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login,
            },
            createdAt: new Date().toISOString(),
        }
        const newCommentWithPostId: CommentTypeWithPostId = {
            postId,
            ...newComment,
        }
        await posts_repositories.createCommentByPostId(newCommentWithPostId)
        return newComment;
    },

    /*------------------------------------------------------------*/

    async getPostIDService(id: string): Promise<PostType | null> {
        return await posts_repositories.getPostID(id);
    },
    async updatePostService(id: string,
                     title: string,
                     shortDescription: string,
                     content: string,
                     blogId: string,): Promise<boolean> {
        return await posts_repositories.updatePost(id,title,shortDescription,content,blogId)
    },
    async deleteIDService(id: string): Promise<boolean> {
        return await posts_repositories.deleteID(id)
    },
}

