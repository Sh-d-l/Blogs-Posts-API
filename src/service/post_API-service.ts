import {PostTypeWithoutLikes, TBlogDb} from "../types/types";
import {CommentType, CommentTypeWithPostId} from "../types/types";
import {randomUUID} from "crypto";
import {PostsRepo} from "../repositories/post_API-repositories-db";
import {CreateObjectOfUserForClient} from "../types/types";
import {BlogsRepo} from "../repositories/blog_API-repositories-db";
import "reflect-metadata";
import {injectable} from "inversify";
import {jwtService} from "../application/jwt-service";
import {LikeStatusOfPostRepo} from "../repositories/likeStatusOfPostRepo";
import {UsersRepoDb} from "../repositories/users_API-repositories-db";
@injectable()

export class PostService {
    constructor( protected blogsRepo:BlogsRepo,
                 protected postsRepo:PostsRepo,
                 protected likeStatusOfPostRepo: LikeStatusOfPostRepo,
                 protected userRepoDb:UsersRepoDb) {
    }
    async likeStatusOfPostService (postId: string, likeStatus: string, accessToken: string | undefined):Promise<boolean> {
        const [bearer,token] = accessToken!.split(" ");
        const userId = await jwtService.getUserIdByAccessToken(token);
        const post = await this.postsRepo.getPostID(postId);
        if(!post) return  false;
        const user = await this.userRepoDb.findUserByUserId(userId)
        const resultSearchByPostId = await this.likeStatusOfPostRepo.getObjectWithLikeStatusOfPost(postId, userId)
        if(!resultSearchByPostId) {
            const object = {
                addedAt: randomUUID(),
                userId,
                login:user?.login,
                likeStatus,
                postId,
            }
            await this.likeStatusOfPostRepo.addObjectWithLikeStatusOfPostToDB(object)
            return true
        }
        if(resultSearchByPostId) {
            await  this.likeStatusOfPostRepo.changeLikeStatusOfPostByUserId(postId,userId,likeStatus)
            return  true
        }
        else return  false
    }

    async createPostService(title: string,
                            shortDescription: string,
                            content: string,
                            blogId: string): Promise<PostTypeWithoutLikes | null> {
        const blog: TBlogDb | null = await this.blogsRepo.getBlogID(blogId)
        if (!blog) return null
        const newPostWithoutLikes = new PostTypeWithoutLikes(
            randomUUID(),
            title,
            shortDescription,
            content,
            blog.id,
            blog.name,
            new Date().toISOString(),
             {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: "None",
                newestLikes: [
            ]
        }
        )
        // const newPost: PostType = {
        //     id: randomUUID(),
        //     title,
        //     shortDescription,
        //     content,
        //     blogId: blog.id,
        //     blogName: blog.name,
        //     createdAt: new Date().toISOString(),
        // }
        await this.postsRepo.createPost(newPostWithoutLikes);
        return newPostWithoutLikes;
    }

      /*----------------------create comment------------------------*/

    async createCommentService(content: string,postId:string, user:CreateObjectOfUserForClient):Promise<CommentType> {
        // const newComment:CommentType = {
        //     id: randomUUID(),
        //     content,
        //     commentatorInfo: {
        //         userId: user.id,
        //         userLogin: user.login,
        //     },
        //     createdAt: new Date().toISOString(),
        // }
        const newCommentWithPostId = new CommentTypeWithPostId(
            postId,
            randomUUID(),
            content,
            {
                userId: user.id,
                userLogin: user.login,
            },
            new Date().toISOString(),
            {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: "None",
            }
        )
        // const newCommentWithPostId: CommentTypeWithPostId = {
        //     postId,
        //     ...newComment,
        // }
        await this.postsRepo.createCommentByPostId(newCommentWithPostId)
       return new CommentType(
            newCommentWithPostId.id,
            newCommentWithPostId.content,
            newCommentWithPostId.commentatorInfo,
            newCommentWithPostId.createdAt,
            newCommentWithPostId.likesInfo

        )
    }

    /*------------------------------------------------------------*/

    async getPostIDService(id: string): Promise<PostTypeWithoutLikes | null> {
         return await this.postsRepo.getPostID(id);



    }

    async updatePostService(id: string,
                     title: string,
                     shortDescription: string,
                     content: string,
                     blogId: string,): Promise<boolean> {
        return await this.postsRepo.updatePost(id,title,shortDescription,content,blogId)
    }

    async deleteIDService(id: string): Promise<boolean> {
        return await this.postsRepo.deleteID(id)
    }
}


