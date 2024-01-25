import {CommentTypeWithPostId, PostTypeWithoutLikes} from "../types/types";
import {
    CreateCommentByPostIDModel,
    CreatePostModel
} from "../mongoDB/db";
import "reflect-metadata";
import {injectable} from "inversify";
@injectable()
export class PostsRepo {
    async createPostForBlog(addPostForBlog: PostTypeWithoutLikes) {
        return await CreatePostModel.create({...addPostForBlog});
    }
    async createPost(newPost: PostTypeWithoutLikes) {
        return await CreatePostModel.create({...newPost});
    }
    async createCommentByPostId(newCommentWithPostId:CommentTypeWithPostId) {
         await CreateCommentByPostIDModel.create({...newCommentWithPostId})
    }
    async getPostID(id: string): Promise<PostTypeWithoutLikes | null> {
        return CreatePostModel.findOne({id},{_id: 0, __v:0});
    }
    async updatePost(id: string,
                     title: string,
                     shortDescription: string,
                     content: string,
                     blogId: string,): Promise<boolean> {
        let updatePostId = await CreatePostModel.updateOne({id: id},
            {
                    title: title,
                    shortDescription: shortDescription,
                    content: content, blogId: blogId
            })
        return !!updatePostId;
    }
    async deleteID(id: string): Promise<boolean> {
        let foundBlogByID = await CreatePostModel.deleteOne({id: id});
        return !!foundBlogByID
    }
}
