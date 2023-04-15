import {blogs_repositories} from "../blog_API-repositories/blog_API-repositories-db";
import {BlogType, TBlogDb, TBlogView} from "../blog_API-repositories/blog_API-repositories-memory";
import {randomUUID} from "crypto";
import {PostType} from "./post_API-repositories-memory";
import {blogCollection, blogDbRepo, client, postDbRepo} from "../repositories/db";
import {ObjectId} from "mongodb";

export const posts_repositories = {
    async getPost(): Promise<PostType[]> {
        return postDbRepo.collection <PostType>("Posts").find({}, {projection: {_id: 0}}).toArray();
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostType | null> {
        try {
            const blog: TBlogDb | null = await blogCollection.findOne({_id: new ObjectId(blogId)})
            if (!blog) return null
            const newPost: PostType = {
                id: randomUUID(),
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blog._id.toString(),
                blogName: blog.name,
                createdAt: new Date(),
            }
            await postDbRepo.collection <PostType>("Posts").insertOne(newPost);
            return newPost;
        } catch (e) {
            return null
        }

    },
    async getPost_ID(id: string): Promise<PostType | null> {
        return postDbRepo.collection<PostType>("Posts").findOne({id: id}, {projection: {_id: 0}});
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string,): Promise<boolean> {
        let updatePostId = await postDbRepo.collection<PostType>("Posts").updateOne({id: id},
            {$set: {title: title, shortDescription: shortDescription, content: content, blogId: blogId}})
        return !!updatePostId.matchedCount;
    },
    async deleteID(id: string): Promise<boolean> {
        let found_blog_by_ID = await postDbRepo.collection("Posts").deleteOne({id: id});
        return !!found_blog_by_ID.deletedCount
    },
    async deleteAll(): Promise<boolean> {
        let delAllPosts = await postDbRepo.collection("Posts").deleteMany();
        return !!delAllPosts.deletedCount
    }
}