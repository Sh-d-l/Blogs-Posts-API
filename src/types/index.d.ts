//import {BlogType} from "../blog_API-repositories/blog_API-repositories-memory";
import {TUsersDb} from "../types/types";


declare global {
     namespace Express {
        export interface Request {
           // blog: BlogType | null
            userId: string | null
            user:TUsersDb | null
        }
    }
}