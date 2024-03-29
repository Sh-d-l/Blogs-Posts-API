import {config} from 'dotenv'
import {
    TBlogDb, TypeCustomRateLimit, TypeRecoveryCode,
    TypeRefreshTokenMeta, LikeStatusOfComment, LikeStatusOfPost
} from "../types/types";
import {PostTypeWithoutLikes} from "../types/types";
import {CreateUsersWithConfirmationCode} from "../types/types";
import {CommentTypeWithPostId} from "../types/types";
import mongoose, {Schema} from "mongoose"

config()

export const DB_NAME = "Blogs-Posts-API";

export const mongoURI = process.env.MONGO_URL || `mongodb://0.0.0.0:27017/${DB_NAME}`

//export const client = new MongoClient(mongoURI)

export async function runDB() {
    if (mongoose.connection.readyState === 1) {
        console.log("already connected");
        return;
    }
    try {
        await mongoose.connect(mongoURI)
        console.log('it is ok')
    } catch (e) {
        console.log('no connection')
        await mongoose.disconnect()
    }
}

console.log(mongoURI)

export const CreateUserWithMailSchema = new Schema<CreateUsersWithConfirmationCode>(
    {
        id: {type: String, required: true},
        login: {type: String, required: true, maxLength: 10, minLength: 3, match: /^[a-zA-Z0-9_-]*$/},
        email: {type: String, required: true, match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/},
        createdAt: {type: String, required: true},
        userHash: {type: String, required: true},
        emailConfirmation: {
            confirmationCode: {type: String, required: true},
            expirationTime: {type: Date, required: true},
            isConfirmed: {type: Boolean, required: true}
        }
    }
)
export const RefreshTokenMetaSchema = new Schema<TypeRefreshTokenMeta>({
    userId: {type: String, required: true},
    deviceId: {type: String, required: true},
    ip: {type: String, required: true},
    lastActiveDate: {type: Date, required: true},
    title: {type: String}
})

export const CreateNewBlogSchema = new Schema<TBlogDb>(
    {
        id: {type: String, required: true},
        name: {type: String, required: true, maxLength: 15},
        description: {type: String, required: true, maxLength: 500},
        websiteUrl: {
            type: String,
            required: true,
            maxLength: 100,
        }/*match: /^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$}*/,
        createdAt: {type: String, required: true},
        isMembership: {type: Boolean, required: true},
    }
)

export const CreatePostSchema = new Schema<PostTypeWithoutLikes>(
    {
        id: {type: String, required: true},
        title: {type: String, required: true, maxLength: 30},
        shortDescription: {type: String, required: true, maxLength: 100},
        content: {type: String, required: true, maxLength: 1000},
        blogId: {type: String, required: true},
        blogName: {type: String, required: true, maxLength: 15},
        createdAt: {type: String, required: true},
    }
)

export const CreateCommentByPostIDSchema = new Schema<CommentTypeWithPostId>(
    {
        postId: {type:String, required: true},
        id: {type: String, required: true},
        content: {type: String, required: true, maxLength: 300, minLength: 20},
        commentatorInfo: {
            userId: {type: String, required: true},
            userLogin: {type: String, required: true},
        },
        createdAt: {type: String, required: true},
        likesInfo:{
            likesCount:{type:Number,required:true},
            dislikesCount:{type:Number,required:true},
            myStatus:{type: String, required: true}
        }
    }
)
export const CreateRateLimitDocumentSchema = new Schema<TypeCustomRateLimit> (
    {
        IP: {type:String, required:true},
        URL: {type:String, required:true},
        date: {type:Date, required:true}
})

export const CreateDocumentWithRecoveryCodeSchema = new Schema<TypeRecoveryCode>(

    {
        userId: {type: String, required: true},
        recoveryCode: {type: String, required: true},
        expirationTime: {type: Date, required: true},
    }
)

export const LikeStatusOfCommentSchema = new Schema<LikeStatusOfComment> (
    {
        commentId:{type:String, required: true},
        userId:{type:String, required: true},
        likeStatus:{type:String, required: true},
    }
)
export const LikeStatusOfPostSchema = new Schema<LikeStatusOfPost> (
    {
        addedAt:{type:String, required: true},
        userId:{type:String, required: true},
        login:{type:String, required: true},
        likeStatus:{type:String, required: true},
        postId:{type:String, required: true}
    }
)

export const CreateUserWithMailModel = mongoose.model('CreateUserWithMailModel', CreateUserWithMailSchema)
export const CreateDocumentWithRecoveryCodeModel = mongoose.model("CreateDocumentWithRecoveryCodeModel", CreateDocumentWithRecoveryCodeSchema)
export const RefreshTokenMetaModel = mongoose.model('RefreshTokenMetaModel', RefreshTokenMetaSchema)
export const CreateNewBlogModel = mongoose.model('CreateNewBlogModel', CreateNewBlogSchema)
export const CreatePostModel = mongoose.model('CreatePostModel', CreatePostSchema)
export const CreateCommentByPostIDModel = mongoose.model('CreateCommentByPostIDModel', CreateCommentByPostIDSchema)
export const CreateRateLimitDocumentModel = mongoose.model("CreateRateLimitDocumentModel", CreateRateLimitDocumentSchema)
export const LikeStatusOfCommentModel = mongoose.model("LikeStatusOfCommentModel", LikeStatusOfCommentSchema)
export const LikeStatusOfPostModel = mongoose.model("LikeStatusOfPostModel", LikeStatusOfPostSchema)
export const collections: any[] =
    [
        CreateCommentByPostIDModel,
        CreateUserWithMailModel,
        CreateDocumentWithRecoveryCodeModel,
        CreateNewBlogModel,
        CreatePostModel,
        CreateRateLimitDocumentModel,
        RefreshTokenMetaModel,
        LikeStatusOfCommentModel,
        LikeStatusOfPostModel
    ]



//export const blogDbRepo = client.db(DB_NAME)
// export const postDbRepo = client.db(DB_NAME)
// export const commentDbRepo = client.db(DB_NAME)
//export const usersDbRepo = client.db(DB_NAME)
// export const blackListRefreshTokenRepo = client.db(DB_NAME)
// export const rateLimitRepo = client.db(DB_NAME)
// export const refreshTokenMetaRepo = client.db(DB_NAME)

// export const commentCollection = commentDbRepo.collection<CommentTypeWithPostId>("Comments")
// export const postCollection = postDbRepo.collection<PostType>("Posts")
//export const blogCollection = blogDbRepo.collection<TBlogDb>("Blogs")
//export const usersCollection = usersDbRepo.collection<TUsersWithHashEmailDb>("UsersWithConfirmMail")
// export const blackListRefreshTokenCollection = blackListRefreshTokenRepo.collection<RevokedRToken>("blacklistRefreshToken")
// export const customRateLimitCollection = rateLimitRepo.collection<TypeCustomRateLimit>("customRateLimit")
// export const refreshTokenMetaCollection = refreshTokenMetaRepo.collection<TypeRefreshTokenMeta>("refreshTokenMeta")




// export async function runDB() {
//     try {
//         await client.connect();
//         await client.db(DB_NAME).command({ping: 1});
//         console.log("Connecting successfully to Mongo server")
//     } catch {
//         console.log("Can't connect to db")
//         await client.close()
//     }
// }


