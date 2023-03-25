import {Request,Response,NextFunction} from "express";
import {CustomValidator } from 'express-validator';
import {blogs_repositories} from "../blog_API-repositories/blog_API-repositories";
export const validatorAddPostByIdBlog = (req:Request,res:Response,next:NextFunction) => {
    const customValidatorPostId: CustomValidator = value => {
        return blogs_repositories.checkBlogByName(value);
    }
    if(customValidatorPostId) {
        throw new Error("Blog with provided ID not found");
    }
    else {
        next()
    }
};