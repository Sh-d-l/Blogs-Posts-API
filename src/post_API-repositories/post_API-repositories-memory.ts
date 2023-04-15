import {blogs_repositories} from "../blog_API-repositories/blog_API-repositories-memory";
import {randomUUID} from "crypto";

const posts:PostType[] = [];
export type PostType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
    createdAt: string,
}
export const posts_repositories = {
    async getPost ():Promise<PostType[]> {
        return posts;
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string):Promise<PostType | null> {
        const blog = await blogs_repositories.getBlogID(blogId)
        if (!blog) return  null
        const newPost:PostType = {
            id: randomUUID(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blog.id,
            blogName: blog.name,
            createdAt: new Date().toISOString(),
        }
        posts.push(newPost)
        return newPost;

    },
    async getPostID (id:string):Promise<PostType | undefined> {
        return posts.find((elem) => elem.id === id )
    },
    async updatePost(id:string,title:string, shortDescription:string, content:string,blogId: string,):Promise<boolean> {
        let findID = posts.find((elem) => elem.id === id );
        if(findID) {
            findID.title = title;
            findID.shortDescription = shortDescription;
            findID.content = content;
            findID.blogId = blogId;
            return true;
        }
        else {
            return false;
        }
    },
    async deleteID (id:string):Promise<boolean> {
        let found_blog_by_ID = posts.filter((elem) => elem.id === id );
        if(found_blog_by_ID.length > 0) {
            posts.splice(posts.indexOf(found_blog_by_ID[0]),1)
            return true;
        }
        else {
            return  false;
        }
    },
    async deleteAll ():Promise<boolean> {
        posts.splice(0,posts.length)
        return true;
    }
}