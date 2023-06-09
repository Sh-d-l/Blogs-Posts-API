import {CommentTypeWithPostId, PostType} from "../types/types";
import {postCollection, commentCollection} from "./db";

export const posts_repositories = {
    async getPost(): Promise<PostType[]> {
        return postCollection.find({}, {projection: {_id: 0}}).toArray();
    },
    async createPostForBlog(addPostForBlog: PostType) {
        return await postCollection.insertOne({...addPostForBlog});
    },
    async createPost(newPost: PostType) {
        return await postCollection.insertOne({...newPost});
    },
    async createCommentByPostId(newCommentWithPostId:CommentTypeWithPostId) {
         await commentCollection.insertOne({...newCommentWithPostId})
    },
    async getPostID(id: string): Promise<PostType | null> {
        return await postCollection.findOne({id}, {projection: {_id: 0}});
    },
    async updatePost(id: string,
                     title: string,
                     shortDescription: string,
                     content: string,
                     blogId: string,): Promise<boolean> {
        let updatePostId = await postCollection.updateOne({id: id},
            {
                $set: {
                    title: title,
                    shortDescription: shortDescription,
                    content: content, blogId: blogId
                }
            })
        return !!updatePostId.matchedCount;
    },
    async deleteID(id: string): Promise<boolean> {
        let foundBlogByID = await postCollection.deleteOne({id: id});
        return !!foundBlogByID.deletedCount
    },
}