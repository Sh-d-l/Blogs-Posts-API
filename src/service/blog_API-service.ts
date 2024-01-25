//import {blogs_repositories} from "../repositories/blog_API-repositories-db";
import {PostTypeWithLikes, PostTypeWithoutLikes, TBlogDb} from "../types/types";
import {randomUUID} from "crypto";
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
                             content: string,): Promise<PostTypeWithoutLikes | null> {
        const getBlogForCreatePost: TBlogDb | null = await this.blogsRepo
            .getBlogID(blogId);
        if (getBlogForCreatePost) {
            const addPostForBlog = new PostTypeWithoutLikes(
                randomUUID(),
                title,
                shortDescription,
                content,
                getBlogForCreatePost.id,
                getBlogForCreatePost.name,
                new Date().toISOString(),
                {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: "None",
                    newestLikes: [
                    ]
                }

            )

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

