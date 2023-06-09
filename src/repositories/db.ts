import * as dotenv from 'dotenv'
import {MongoClient} from "mongodb";
import {TBlogDb} from "../blog_API-repositories/blog_API-repositories-memory";
import {PostType} from "../post_API-repositories/post_API-repositories-memory";
import {TUsersWithHashDb} from "../users_API-repositories/users_API-repositories-db";
import {CommentType} from "../post_API-repositories/post_API-repositories-db";

dotenv.config()

export const DB_NAME = "Blogs-Posts-API";

const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'
export const client = new MongoClient(mongoURI)

export const blogDbRepo = client.db(DB_NAME)
export const postDbRepo = client.db(DB_NAME)
export const commentDbRepo = client.db(DB_NAME)
export const usersDbRepo = client.db(DB_NAME)

export const commentCollection = commentDbRepo.collection<CommentType>("Comments")
export const postCollection = postDbRepo.collection<PostType>("Posts")
export const blogCollection = blogDbRepo.collection<TBlogDb>("Blogs")
export const usersCollection = usersDbRepo.collection<TUsersWithHashDb>("Users")

export const collections = [blogCollection, postCollection, usersCollection]

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
