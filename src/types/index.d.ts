import {CreateObjectOfUserForClient} from "../types/types";


declare global {
     namespace Express {
        export interface Request {
           // blog: BlogType | null
            userId: string | null
            user:CreateObjectOfUserForClient | null
        }
    }
}