import {randomUUID} from "crypto";
import {TBlogDb} from "../types/types";

const blogs: TBlogDb[] = [];

export const blogs_repositories = {
    async getBlogs(): Promise<TBlogDb[]> {
        return blogs;
    },
    async createBlog(name: string, description: string, websiteUrl: string): Promise<TBlogDb> {
        const newBlog: TBlogDb = {
            id: randomUUID(),
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false,
        }
        blogs.push(newBlog)
        return newBlog;
    },
    async getBlogID(id: string): Promise<TBlogDb | undefined> {
        return blogs.find((elem) => elem.id === id);
    },
    async updateBlog(id: string, name: string, description: string, websiteUrl: string,): Promise<boolean> {
        let findID = blogs.find((elem) => elem.id == id);
        if (findID) {
            findID.name = name;
            findID.description = description;
            findID.websiteUrl = websiteUrl;
            return true;
        } else {
            return false;
        }
    },
    async deleteID(id: string): Promise<boolean> {
        let found_blog_by_ID = blogs.filter((elem) => elem.id === id);
        if (found_blog_by_ID.length > 0) {
            blogs.splice(blogs.indexOf(found_blog_by_ID[0]), 1)
            return true;
        } else {
            return false;
        }
    },
    async deleteAll(): Promise<boolean> {
        blogs.splice(0, blogs.length)
        return true;
    }
}
