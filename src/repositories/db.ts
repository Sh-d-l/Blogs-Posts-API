import dotenv from 'dotenv'
import {MongoClient} from "mongodb";

dotenv.config()

const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'
export const client = new MongoClient(mongoURI)
export async function runDb() {
    try {
        await client.connect();
        await client.db("posts-blogs").command({ping:1});
        console.log("Connecting successfully to Mongo server")
    }
    catch {
        console.log ("Can't connect to db")
        await client.close()
    }
}
console.log(process.env.MONGO_URL)
//output - mongodb+srv://a:a@ava.epzello.mongodb.net/?retryWrites=true&w=majority