import {TBlogDb} from "../blog_API-repositories/blog_API-repositories-memory";
import {randomUUID} from "crypto";
import {PostType} from "./post_API-repositories-memory";
import {blogCollection, postCollection} from "../repositories/db";

export const posts_repositories = {
    async getPost(): Promise<PostType[]> {
        return postCollection.find({}, {projection: {_id: 0}}).toArray();
    },
    async createPost(title: string,
                     shortDescription: string,
                     content: string,
                     blogId: string): Promise<PostType | null> {
            const blog: TBlogDb | null = await blogCollection.findOne({id: blogId},{projection: {_id: false}})
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
            await postCollection.insertOne({...newPost});
            return newPost;
        },

    async getPostID(id: string): Promise<PostType | null> {
        return postCollection.findOne({id: id}, {projection: {_id: 0}});
    },
    async updatePost(id: string,
                     title: string,
                     shortDescription: string,
                     content: string,
                     blogId: string,): Promise<boolean> {
        let updatePostId = await postCollection.updateOne({id: id},
            {$set: {title: title,
                    shortDescription: shortDescription,
                    content: content, blogId: blogId}})
        return !!updatePostId.matchedCount;
    },
    async deleteID(id: string): Promise<boolean> {
        let foundBlogByID = await postCollection.deleteOne({id: id});
        return !!foundBlogByID.deletedCount
    },
    async deleteAll(): Promise<boolean> {
        let delAllPosts = await postCollection.deleteMany();
        return !!delAllPosts.deletedCount
    }
}