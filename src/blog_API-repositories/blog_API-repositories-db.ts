import {randomUUID} from "crypto";
import {blogDbRepo, client} from "../repositories/db";
import {BlogType} from "./blog_API-repositories-memory";
import {ObjectId} from "mongodb";

export const  blogs_repositories = {
    async getBlogs():Promise<BlogType[]> {
        return client.db("Blogs-Posts-API").collection <BlogType> ("Blogs").find({},{projection:{_id:0}}).toArray();
    },
    async createBlog(name: string, description: string, websiteUrl: string):Promise<BlogType> {
        const newBlog: BlogType = {
            id: randomUUID(),
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date(),
            isMembership: false,
        }
        const result = await client.db("Blogs-Posts-API").collection <BlogType> ("Blogs").insertOne(newBlog);
        return newBlog;
    },
    async getBlog_ID(id: string):Promise<BlogType | null> {

        return client.db("Blogs-Posts-API").collection<BlogType>("Blogs").findOne({id:id},{projection:{_id:0}})
    },
    async updateBlog(id: string, name: string, description: string, websiteUrl: string,):Promise<boolean> {
        const resultUpdate = await client.db("Blogs-Posts-API").collection<BlogType>("Blogs").updateOne({id:id},
            {$set: {name:name,description:description,websiteUrl:websiteUrl }})
        return !!resultUpdate.matchedCount;
    },
    async deleteID(id: string):Promise<boolean> {
        const found_blog_by_ID = await client.db("Blogs-Posts-API").collection<BlogType>("Blogs").deleteOne({id:id});
        return !!found_blog_by_ID.deletedCount
    },
    async deleteAll():Promise<boolean> {
        let delAllBlogs = await blogDbRepo.deleteMany();

        return !!delAllBlogs.deletedCount
    }
}
