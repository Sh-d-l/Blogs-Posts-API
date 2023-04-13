import {blogDbRepo, client} from "../repositories/db";
import {BlogType} from "./blog_API-repositories-memory";

export const  blogs_repositories = {
    async getBlogs():Promise<BlogType[]> {
        return blogDbRepo.collection <BlogType> ("Blogs").find({},).toArray();
    },
    async createBlog(name: string, description: string, websiteUrl: string):Promise<BlogType> {
        const newBlog = {
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date(),
            isMembership: false,
        }
        const result = await blogDbRepo.collection("Blogs").insertOne({...newBlog});

        return {
            id: result.insertedId.toString(),
            name: newBlog.name,
            description: newBlog.description,
            websiteUrl: newBlog.websiteUrl,
            createdAt: newBlog.createdAt,
            isMembership: newBlog.isMembership,
        };
    },
    async getBlog_ID(id: string):Promise<BlogType | null> {
        return blogDbRepo.collection<BlogType>("Blogs").findOne({id:id})
    },
    async updateBlog(id: string, name: string, description: string, websiteUrl: string,):Promise<boolean> {
        const resultUpdate = await blogDbRepo.collection<BlogType>("Blogs").updateOne({id:id},
            {$set: {name:name,description:description,websiteUrl:websiteUrl }})
        return !!resultUpdate.matchedCount;
    },
    async deleteID(id: string):Promise<boolean> {
        const found_blog_by_ID = await blogDbRepo.collection<BlogType>("Blogs").deleteOne({id:id});
        return !!found_blog_by_ID.deletedCount
    },
    async deleteAll():Promise<boolean> {
        let delAllBlogs = await blogDbRepo.collection("Blogs").deleteMany();
        return !!delAllBlogs.deletedCount
    }
}
