import {TBlogDb} from "./blog_API-repositories-memory";
import {blogs_repositories} from "./blog_API-repositories-db";
import {blogCollection, postCollection} from "../repositories/db";
import{PostType} from "../post_API-repositories/post_API-repositories-memory";

export type TypeGetBlogs = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: [
        {
            id: string,
            name: string,
            description: string,
            websiteUrl: string,
            createdAt: string,
            isMembership: boolean
        }
    ]
}
export type TypeGetPostsByBlogId = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: [
        {
            id :  string ,
            title :  string,
            shortDescription: string,
            content: string,
            blogId: string,
            blogName: string,
            createdAt: string,
        }
    ]
}


export const blogsRepoQuery = {
   async  getBlogsRepoQuery():Promise<TypeGetBlogs[]> {
       const getBlogsDB:TBlogDb[] = await blogCollection.find({}).toArray()
       const newArr:TypeGetBlogs = getBlogsDB.map((blog:TBlogDb) => {
            return {
                pagesCount: 0,
                page: 0,
                pageSize: 0,
                totalCount: 0,
                items: [
                    {
                        id: blog.id,
                        name: blog.name,
                        description: blog.description,
                        websiteUrl: blog.websiteUrl,
                        createdAt: blog.createdAt,
                        isMembership: blog.isMembership
                    }
                ]
            }
        })
       console.log(newArr)
       return newArr;
    },
    async getAllPostsByBlogId(id:string): Promise<TypeGetPostsByBlogId[]> {
        const getPosts = await postCollection.find({blogId:id}).toArray()
        const arrPostsWithNewType:TypeGetPostsByBlogId = getPosts.map((post:PostType) => {
            return {
                pagesCount: 0,
                page: 0,
                pageSize: 0,
                totalCount: 0,
                items: [
                    {
                        id: post.id,
                        title: post.title,
                        shortDescription: post.shortDescription,
                        content: post.content,
                        blogId: id,
                        blogName: post.blogName,
                        createdAt: post.createdAt,
                    }
                ]
            }
        })
        return arrPostsWithNewType
},

}