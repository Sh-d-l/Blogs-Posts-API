import {CreateNewBlogModel} from "../mongoDB/db";
import {TBlogDb} from "../types/types";
//import {blogs_repositories} from "./blog_API-repositories-memory";

class BlogsRepo {
    async getBlogs(): Promise<TBlogDb[]> {
        return CreateNewBlogModel.find({}, {projection: {_id: 0}}).lean();
    }
    async createBlog(newBlog: TBlogDb) {
        await CreateNewBlogModel.create({...newBlog});
    }
    async getBlogID(id: string): Promise<TBlogDb | null> {
        return CreateNewBlogModel.findOne({id: id}, {projection: {_id: false}});
    }
    async updateBlog(id: string, name: string, description: string, websiteUrl: string,): Promise<boolean> {
        const resultUpdate = await CreateNewBlogModel.updateOne({id},
             {name, description, websiteUrl}
        )
        return !!resultUpdate;
    }
    async deleteID(id: string): Promise<boolean> {
        const found_blog_by_ID = await CreateNewBlogModel.deleteOne({id});
        return !!found_blog_by_ID
    }

}
export const blogs_repositories = new BlogsRepo()

