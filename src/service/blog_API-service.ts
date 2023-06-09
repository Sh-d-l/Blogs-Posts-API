import {blogs_repositories} from "../repositories/blog_API-repositories-db";
import {TBlogDb} from "../types/types";
import {randomUUID} from "crypto";
import {PostType} from "../types/types";
import {posts_repositories} from "../repositories/post_API-repositories-db";

export const blogsService = {
    async createBlogService(name: string,
                            description: string,
                            websiteUrl: string): Promise<TBlogDb> {
        const newBlog: TBlogDb = {
            id: randomUUID(),
            name,
            description,
            websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false,
        }
        await blogs_repositories.createBlog(newBlog)
        return newBlog;
    },

    async createPostByBlogId(blogId: string,
                             title: string,
                             shortDescription: string,
                             content: string,): Promise<PostType | null> {
        const getBlogForCreatePost: TBlogDb | null = await blogs_repositories
            .getBlogID(blogId);
        if (getBlogForCreatePost) {
            const addPostForBlog: PostType = {
                id: randomUUID(),
                title,
                shortDescription,
                content,
                blogId: getBlogForCreatePost.id,
                blogName: getBlogForCreatePost.name,
                createdAt: new Date().toISOString(),
            }
            await posts_repositories.createPostForBlog(addPostForBlog)
            return addPostForBlog;
        } else {
            return null;
        }
    },

    async getBlogIDService(id: string): Promise<TBlogDb | null> {
        return await blogs_repositories.getBlogID(id);
    },

    async updateBlogService(id: string, name: string, description: string, websiteUrl: string,): Promise<boolean> {
        return await blogs_repositories.updateBlog(id, name, description, websiteUrl)
    },

    async deleteIDService(id: string): Promise<boolean> {
        return await blogs_repositories.deleteID(id);
    },
}
