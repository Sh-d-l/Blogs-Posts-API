import {TBlogDb} from "./blog_API-repositories-memory";
import {blogCollection, postCollection} from "../repositories/db";
import{PostType} from "../post_API-repositories/post_API-repositories-memory";
import {SortDirection} from "mongodb";

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
   async  getBlogsRepoQuery(searchNameTerm:string | null,
                            sortBy:string,
                            sortDirection: SortDirection ,
                            pageNumber:number,
                            pageSize:number):Promise<TypeGetBlogs[]> {
       /*console.log(sortDirection)
       console.log(sortBy)*/
       const skip:number  = (+pageNumber - 1) * +pageSize;
       const countBlogs:number =  await blogCollection.countDocuments({});
       const countPages:number = Math.ceil(countBlogs / +pageSize);
       const filterSearchNameTerm = {name:{}};
       if(searchNameTerm) {
           filterSearchNameTerm.name = {$regex:searchNameTerm, $options:"i"}
       }
       /*console.log("skip",skip)
       console.log("countBlogs",countBlogs)
       console.log("countPages", countPages)
       console.log("filter",filterSearchNameTerm)*/
       const getBlogsDB:TBlogDb[] = await blogCollection
           .find({})
           .skip(skip)
           .limit(pageSize)
           .sort({sortBy: sortDirection})
           .toArray()
       const newArr:TypeGetBlogs[] = getBlogsDB.map((blog:TBlogDb) => {
            return {
                pagesCount: countPages,
                page: pageNumber,
                pageSize: pageSize,
                totalCount: countBlogs,
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
       return newArr;
    },

    async getAllPostsByBlogId(id:string,
                              sortBy:string,
                              sortDirection:SortDirection,
                              pageNumber:number,
                              pageSize:number): Promise<TypeGetPostsByBlogId[]> {
        const skip:number  = (+pageNumber - 1) * +pageSize
        const countAllPosts:number =  await blogCollection.countDocuments({})
        const countPages:number = Math.ceil(countAllPosts / +pageSize)
        /*let sortBlogs: SortDirection;
        if(sortDirection === "desc") {
            sortBlogs = -1;
        }
        if(sortDirection === "asc") {
            sortBlogs = 1;
        }*/
        const getPosts:PostType[] = await postCollection
            .find({})
            .sort({sortBlogs: sortDirection})
            .skip(skip)
            .limit(pageSize)
            .toArray()
        const arrPostsWithNewType:TypeGetPostsByBlogId[] = getPosts
            .map((post:PostType) => {
            return {
                pagesCount: countPages,
                page: pageNumber,
                pageSize: pageSize,
                totalCount: countAllPosts,
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