import {blogs_repositories} from "../blog_API-repositories/blog_API-repositories-db";
import {BlogType} from "../blog_API-repositories/blog_API-repositories-memory";
import {randomUUID} from "crypto";
import {PostType} from "./post_API-repositories-memory";
import {client} from "../repositories/db";

export const posts_repositories = {
    async getPost ():Promise<PostType[]> {
        return client.db("Blogs-Posts-API").collection <PostType> ("Posts").find({}).toArray();
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string):Promise<PostType | null> {
        const blog:BlogType | null = await blogs_repositories.getBlog_ID(blogId)
        if (!blog) return  null
        const newPost:PostType = {
            id: randomUUID(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blog.id,
            blogName: blog.name,
            createdAt: new Date(),
        }
        await client.db("Blogs-Posts-API").collection <PostType> ("Posts").insertOne(newPost);
        return newPost;
    },
    async getPost_ID (id:string):Promise<PostType | null> {
        return client.db("Blogs-Posts-API").collection<PostType>("Posts").findOne({id:id});
       },
    async updatePost(id:string,title:string, shortDescription:string, content:string,blogId: string,):Promise<boolean> {
        let updatePostId = await client.db("Blogs-Posts-API").collection<PostType>("Posts").updateOne({id:id},
            {$set: {title:title,shortDescription:shortDescription,content:content,blogId:blogId}})
        return !!updatePostId.matchedCount;
    },
    async deleteID (id:string):Promise<boolean> {
        let found_blog_by_ID = await client.db("Blogs-Posts-API").collection("Posts").deleteOne({id:id});
        return !!found_blog_by_ID.deletedCount
    },
    async deleteAll ():Promise<boolean> {
        return client.db("Blogs-Posts-API").collection("Posts").drop();
    }
}