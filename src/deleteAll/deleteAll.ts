import {blogs_repositories} from "../blog_API-repositories/blog_API-repositories";
import {posts_repositories} from "../post_API-repositories/post_API-repositories";
import {Router} from "express";
export const delAll_Router = Router({});

delAll_Router.delete('/',(req,res) => {
    const delPost = posts_repositories.deleteAll()
    const delBlog = blogs_repositories.deleteAll()
    if(delBlog && delPost) {
        res.sendStatus(204)
    }

})