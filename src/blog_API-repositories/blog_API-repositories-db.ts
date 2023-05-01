import {blogCollection} from "../repositories/db";
import {TBlogDb} from "./blog_API-repositories-memory";

export const blogs_repositories = {
    async getBlogs(): Promise<TBlogDb[]> {
        return blogCollection.find({}, {projection: {_id: 0}}).toArray();
    },
    async createBlog(newBlog: TBlogDb) {
        await blogCollection.insertOne({...newBlog});
    },
    async getBlogID(id: string): Promise<TBlogDb | null> {
        return await blogCollection.findOne({id: id}, {projection: {_id: false}});
    },
    async updateBlog(id: string, name: string, description: string, websiteUrl: string,): Promise<boolean> {
        const resultUpdate = await blogCollection.updateOne({id},
            {$set: {name, description, websiteUrl}}
        )
        return !!resultUpdate.matchedCount;
    },
    async deleteID(id: string): Promise<boolean> {
        const found_blog_by_ID = await blogCollection.deleteOne({id});
        return !!found_blog_by_ID.deletedCount
    },

}

