import {TBlogDb} from "../blog_API-repositories/blog_API-repositories-memory";
import {CommentType} from "../post_API-repositories/post_API-repositories-db";
import {randomUUID} from "crypto";
import {PostType} from "../post_API-repositories/post_API-repositories-memory";
import {blogCollection, postCollection} from "../repositories/db";
import {posts_repositories} from "../post_API-repositories/post_API-repositories-db";

export const postService = {
    async getPostService(): Promise<PostType[]> {
        return posts_repositories.getPost();
    },
    async createPostService(title: string,
                     shortDescription: string,
                     content: string,
                     blogId: string): Promise<PostType | null> {
            const blog: TBlogDb | null = await blogCollection
                .findOne({id: blogId})
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
        async createCommentService(content:string):Promise<CommentType> {
            const
            const
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