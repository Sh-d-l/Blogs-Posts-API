import {TBlogDb} from "../blog_API-repositories/blog_API-repositories-memory";
import {CommentType} from "../post_API-repositories/post_API-repositories-db";
import {randomUUID} from "crypto";
import {PostType} from "../post_API-repositories/post_API-repositories-memory";
import {posts_repositories} from "../post_API-repositories/post_API-repositories-db";
import {TUsersDb} from "../users_API-repositories/usersRepositoriesQuery";
import {blogs_repositories} from "../blog_API-repositories/blog_API-repositories-db";

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

        async createCommentService(content: string
                                   , user: TUsersDb):Promise<CommentType> {
            const newComment:CommentType = {
                id: randomUUID(),
                content,
                commentatorInfo: {
                    userId: user.id,
                    userLogin: user.login,
                },
                createdAt: new Date().toISOString(),
            }
            await posts_repositories.createCommentByPostId(newComment)
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