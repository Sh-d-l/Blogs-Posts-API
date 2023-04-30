import {TBlogDb} from "./blog_API-repositories-memory";
import {blogCollection, postCollection} from "../repositories/db";
import {PostType} from "../post_API-repositories/post_API-repositories-memory";
import {SortDirection} from "mongodb";

export type TypeGetBlogsWithCount = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: TBlogDb[]
}

export type TypeGetPostsByBlogId = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: PostType[]
}

export const blogsRepoQuery = {
    async getBlogsRepoQuery(searchNameTerm: string | null,
                            sortBy: string,
                            sortDirection: SortDirection,
                            pageNumber: number,
                            pageSize: number): Promise<TypeGetBlogsWithCount> {
        const skip: number = (+pageNumber - 1) * +pageSize;
        let filterSearchNameTerm = searchNameTerm
            ? {name: new RegExp(searchNameTerm, "i")}
            : {};
        const countBlogs: number = await blogCollection.countDocuments(filterSearchNameTerm);
        const countPages: number = Math.ceil(countBlogs / +pageSize);
        const getBlogsDB: TBlogDb[] = await blogCollection
            .find(filterSearchNameTerm, {projection: {_id: false}})
            .skip(skip)
            .limit(pageSize)
            .sort({sortBy: sortDirection})
            .toArray()
        const resArrBlogs: TypeGetBlogsWithCount = {
            pagesCount: countPages,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: countBlogs,
            items: getBlogsDB,
        }
        return resArrBlogs;
    },

    async getAllPostsByBlogId(id: string,
                              sortBy: string,
                              sortDirection: SortDirection,
                              pageNumber: number,
                              pageSize: number): Promise<TypeGetPostsByBlogId | null> {
        const skip: number = (+pageNumber - 1) * +pageSize
        const countAllPosts: number = await postCollection.countDocuments({blogId: id})
        const countPages: number = Math.ceil(countAllPosts / +pageSize)
        const getPosts: PostType[] = await postCollection
            .find({blogId: id}, {projection: {_id: false}})
            .sort({[sortBy]: sortDirection})
            .skip(skip)
            .limit(pageSize)
            .toArray()
        if(getPosts.length > 0) {
            const resArrPosts: TypeGetPostsByBlogId = {
                pagesCount: countPages,
                page: pageNumber,
                pageSize: pageSize,
                totalCount: countAllPosts,
                items: getPosts
            }
            return resArrPosts;
        }
        else {
            return null;
        }


    },

}