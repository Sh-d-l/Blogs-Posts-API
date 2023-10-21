import {CommentTypeWithPostId, PostType} from "../types/types";
import {
    CreateCommentByPostIDModel,
    CreatePostModel
} from "../mongoDB/db";

export class PostsRepo {
    async getPost(): Promise<PostType[]> {
        return CreatePostModel.find({}, {projection: {_id: 0}}).lean();
    }
    async createPostForBlog(addPostForBlog: PostType) {
        return await CreatePostModel.create({...addPostForBlog});
    }
    async createPost(newPost: PostType) {
        return await CreatePostModel.create({...newPost});
    }
    async createCommentByPostId(newCommentWithPostId:CommentTypeWithPostId) {
         await CreateCommentByPostIDModel.create({...newCommentWithPostId})
    }
    async getPostID(id: string): Promise<PostType | null> {
        return CreatePostModel.findOne({id}, {projection: {_id: 0}});
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
