import {TBlogDb, TypeGetBlogsWithCount, TypeGetPostsByBlogId} from "../types/types";
import {CreateNewBlogModel, CreatePostModel} from "../mongoDB/db";
import {PostType} from "../types/types";
import {SortDirection} from "mongodb";
class BlogsRepoQuery {
    async getBlogsRepoQuery(searchNameTerm: string | null,
                            sortBy: string,
                            sortDirection: SortDirection,
                            pageNumber: number,
                            pageSize: number): Promise<TypeGetBlogsWithCount> {
        const skip: number = (+pageNumber - 1) * +pageSize;
        let filterSearchNameTerm = searchNameTerm
            ? {name: new RegExp(searchNameTerm, "i")}
            : {};
        const countBlogs: number = await CreateNewBlogModel.countDocuments(filterSearchNameTerm);
        const countPages: number = Math.ceil(countBlogs / +pageSize);
        const getBlogsDB: TBlogDb[] = await CreateNewBlogModel
            .find(filterSearchNameTerm, {projection: {_id: false}})
            .skip(skip)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection})
            .lean()
        return {
            pagesCount: countPages,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: countBlogs,
            items: getBlogsDB,
        }
    }

    async getAllPostsByBlogId(id: string,
                              sortBy: string,
                              sortDirection: SortDirection,
                              pageNumber: number,
                              pageSize: number): Promise<TypeGetPostsByBlogId | null> {
        const skip: number = (+pageNumber - 1) * +pageSize
        const countAllPosts: number = await CreatePostModel.countDocuments({blogId: id})
        const countPages: number = Math.ceil(countAllPosts / +pageSize)
        const getPosts: PostType[] = await CreatePostModel
            .find({blogId: id}, {projection: {_id: false}})
            .sort({[sortBy]: sortDirection})
            .skip(skip)
            .limit(pageSize)
            .lean()
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


    }

}
export const blogsRepoQuery = new BlogsRepoQuery()