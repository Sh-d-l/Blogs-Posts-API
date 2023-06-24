import * as dotenv from 'dotenv'
import {MongoClient} from "mongodb";
import {TBlogDb} from "../types/types";
import {PostType} from "../types/types";
import {TUsersWithHashDb, TUsersWithHashEmailDb} from "../types/types";
import {CommentTypeWithPostId} from "../types/types";

dotenv.config()

export const DB_NAME = "Blogs-Posts-API";

const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'
export const client = new MongoClient(mongoURI)

export const blogDbRepo = client.db(DB_NAME)
export const postDbRepo = client.db(DB_NAME)
export const commentDbRepo = client.db(DB_NAME)
export const usersDbRepo = client.db(DB_NAME)

export const commentCollection = commentDbRepo.collection<CommentTypeWithPostId>("Comments")
export const postCollection = postDbRepo.collection<PostType>("Posts")
export const blogCollection = blogDbRepo.collection<TBlogDb>("Blogs")
export const usersSuperAdminCollection = usersDbRepo.collection<TUsersWithHashDb>("UsersSuperAdmin")
export const usersConfirmMailCollection = usersDbRepo.collection<TUsersWithHashEmailDb>("UsersWithConfirmMail")

export const collections = [blogCollection, postCollection, usersSuperAdminCollection,usersConfirmMailCollection,commentCollection]

export async function runDB() {
    try {
        await client.connect();
        await client.db(DB_NAME).command({ping: 1});
        console.log("Connecting successfully to Mongo server")
    } catch {
        console.log("Can't connect to db")
        await client.close()
    }
}

console.log(process.env.MONGO_URL)
