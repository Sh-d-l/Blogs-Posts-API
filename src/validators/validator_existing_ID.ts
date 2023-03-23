import {CustomValidator } from 'express-validator';
import {blogs_repositories} from "../blog_API-repositories/blog_API-repositories";
export const isValidUser: CustomValidator = value => {
    const  checkBlog = blogs_repositories.checkBlogByName(value);
    return checkBlog;


};