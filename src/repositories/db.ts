import * as dotenv from 'dotenv'
import {MongoClient} from "mongodb";
import {BlogType} from "../blog_API-repositories/blog_API-repositories-memory";

dotenv.config()

export const DB_NAME = "Blogs-Posts-API";

const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'
export const client = new MongoClient(mongoURI)
export const blogDbRepo = client.db(DB_NAME)//.collection <BlogType> ("Blogs")
export const postDbRepo = client.db(DB_NAME)

export async function runDB() {
    try {
        await client.connect();
        await client.db(DB_NAME).command({ping:1});
        console.log("Connecting successfully to Mongo server")
    }
    catch {
        console.log ("Can't connect to db")
        await client.close()
    }
}
console.log(process.env.MONGO_URL)
