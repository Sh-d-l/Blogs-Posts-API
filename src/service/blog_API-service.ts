//import {blogs_repositories} from "../repositories/blog_API-repositories-db";
import {TBlogDb} from "../types/types";
import {randomUUID} from "crypto";
import {PostType} from "../types/types";
import {BlogsRepo} from "../repositories/blog_API-repositories-db";
import {PostsRepo} from "../repositories/post_API-repositories-db";
import "reflect-metadata";
import {injectable} from "inversify";
@injectable()

export class BlogsService {

    constructor(protected blogsRepo:BlogsRepo,
                protected postsRepo:PostsRepo) {
    }
    async createBlogService(name: string,
                            description: string,
                            websiteUrl: string): Promise<TBlogDb> {
        const newBlog = new TBlogDb(
            randomUUID(),
            name,
            description,
            websiteUrl,
            new Date().toISOString(),
            false,
        )
        // const newBlog: TBlogDb = {
        //     id: randomUUID(),
        //     name,
        //     description,
        //     websiteUrl,
        //     createdAt: new Date().toISOString(),
        //     isMembership: false,
        // }
        await this.blogsRepo.createBlog(newBlog)
        return newBlog;
    }

    async createPostByBlogId(blogId: string,
                             title: string,
                             shortDescription: string,
                             content: string,): Promise<PostType | null> {
        const getBlogForCreatePost: TBlogDb | null = await this.blogsRepo
            .getBlogID(blogId);
        if (getBlogForCreatePost) {
            const addPostForBlog = new PostType(
                randomUUID(),
                title,
                shortDescription,
                content,
                getBlogForCreatePost.id,
                getBlogForCreatePost.name,
                new Date().toISOString(),
            )
            // const addPostForBlog: PostType = {
            //     id: randomUUID(),
            //     title,
            //     shortDescription,
            //     content,
            //     blogId: getBlogForCreatePost.id,
            //     blogName: getBlogForCreatePost.name,
            //     createdAt: new Date().toISOString(),
            // }
            await this.postsRepo.createPostForBlog(addPostForBlog)
            return addPostForBlog;
        } else {
            return null;
        }
    }

    async getBlogIDService(id: string): Promise<TBlogDb | null> {
        return await this.blogsRepo.getBlogID(id);
    }

    async updateBlogService(id: string, name: string, description: string, websiteUrl: string,): Promise<boolean> {
        return await this.blogsRepo.updateBlog(id, name, description, websiteUrl)
    }

    async deleteIDService(id: string): Promise<boolean> {
        return await this.blogsRepo.deleteID(id);
    }
}

