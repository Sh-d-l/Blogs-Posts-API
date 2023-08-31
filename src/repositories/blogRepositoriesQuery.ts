import {TBlogDb, TypeGetBlogsWithCount, TypeGetPostsByBlogId} from "../types/types";
import {blogCollection, postCollection} from "../mongoDB/db";
import {PostType} from "../types/types";
import {SortDirection} from "mongodb";
import {CommentType} from "../types/types";
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
            .sort({[sortBy]: sortDirection})
            .toArray()
        return {
            pagesCount: countPages,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: countBlogs,
            items: getBlogsDB,
        }
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
            return {
                pagesCount: countPages,
                page: pageNumber,
                pageSize: pageSize,
                totalCount: countAllPosts,
                items: getPosts
            }
        }
        else {
            return null;
        }


    },

}