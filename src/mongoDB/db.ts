import * as dotenv from 'dotenv'
import { MongoClient} from "mongodb";
import {RevokedRToken, TBlogDb, TypeCustomRateLimit, TypeRefreshTokenMeta} from "../types/types";
import {PostType} from "../types/types";
import {TUsersWithHashEmailDb} from "../types/types";
import {CommentTypeWithPostId} from "../types/types";
import mongoose from "mongoose"
import {WithId} from "mongodb";

dotenv.config()

export const DB_NAME = "Blogs-Posts-API";

const mongoURI = process.env.mongoURI || `mongodb://0.0.0.0:27017/${DB_NAME}`

export const client = new MongoClient(mongoURI)

export const CreateUserWithMailSchema = new mongoose.Schema<WithId<TUsersWithHashEmailDb>> (
    {
        id: {String, require:true},
        login: {String, require: true,maxLength: 10, minLength:3, match: "^[a-zA-Z0-9_-]*$"},
        email: {String, require: true, match: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$"},
        createdAt: {Date, require:true},
        userHash: {String, require:true},
        emailConfirmation: {
            confirmationCode:{String, require:true},
            expirationTime: {String, require:true},
            isConfirmed: {Boolean, require:true}
        }
    }
)

export const RegistrationConfirmationSchema = new mongoose.Schema<WithId<String>> (
    {
        code:{String,require:true}
    }
)

export const RegistrationEmailResendingSchema = new mongoose.Schema<WithId<String>> (
    {
        email: {String, require: true, match:"^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$"}
    }
)

export const CreateNewBlogSchema = new mongoose.Schema <WithId<TBlogDb>>(
    {
        id:{String, require:true},
        name: {String,require:true, maxLength: 15},
        description: {String, require:true, maxLength:500},
        websiteUrl:{String, require:true, maxLength: 100, match: "^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$"},
        createdAt: {Date, require:true},
        isMembership: {Boolean, require:true}
    }
)

export const CreatePostSchema = new mongoose.Schema<WithId<PostType>> (
    {
        id:{String, require:true},
        title: {String, require:true, maxLength: 30},
        shortDescription: {String, require:true, maxLength: 100},
        content: {String, require:true, maxLength: 1000},
        blogId: {String, require:true},
        blogName: {String,require:true, maxLength: 15},
        createdAt: {Date, require:true},
    }
)

export const CreateCommentByPostIDSchema = new mongoose.Schema<WithId<CommentTypeWithPostId>> (
    {
        id:{String, require:true},
        content: {String, require:true, maxLength: 300, minLength: 20},
        commentatorInfo: {
            userId: {String, require:true},
            userLogin: {String, require:true},
        },
        createdAt: {Date, require:true},
    }
)



export const blogDbRepo = client.db(DB_NAME)
export const postDbRepo = client.db(DB_NAME)
export const commentDbRepo = client.db(DB_NAME)
export const usersDbRepo = client.db(DB_NAME)
export const blackListRefreshTokenRepo = client.db(DB_NAME)
export const rateLimitRepo = client.db(DB_NAME)
export const refreshTokenMetaRepo = client.db(DB_NAME)

export const commentCollection = commentDbRepo.collection<CommentTypeWithPostId>("Comments")
export const postCollection = postDbRepo.collection<PostType>("Posts")
export const blogCollection = blogDbRepo.collection<TBlogDb>("Blogs")
export const usersCollection = usersDbRepo.collection<TUsersWithHashEmailDb>("UsersWithConfirmMail")
export const blackListRefreshTokenCollection = blackListRefreshTokenRepo.collection<RevokedRToken>("blacklistRefreshToken")
export const customRateLimitCollection = rateLimitRepo.collection<TypeCustomRateLimit>("customRateLimit")
export const refreshTokenMetaCollection = refreshTokenMetaRepo.collection<TypeRefreshTokenMeta>("refreshTokenMeta")

export const collections =
    [blogCollection,
    postCollection,
    usersCollection,
    commentCollection,
    blackListRefreshTokenCollection,
    refreshTokenMetaCollection,
    customRateLimitCollection]

export async function runDB() {
    try {
        await mongoose.connect(mongoURI)
        console.log('it is ok')
    } catch (e) {
        console.log('no connection')
        await mongoose.disconnect()
    }
}
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

console.log(process.env.MONGO_URL)
