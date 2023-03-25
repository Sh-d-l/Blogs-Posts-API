import {BlogType} from "../blog_API-repositories/blog_API-repositories";


declare global {
     namespace Express {
        export interface Request {
            blog: BlogType | null
        }
    }
}