import {blogs_repositories} from "../blog_API-repositories/blog_API-repositories";
import {posts_repositories} from "../post_API-repositories/post_API-repositories";
import {Router} from "express";
export const delAll_Router = Router({});

delAll_Router.delete('/',(req,res) => {
    const delPost = posts_repositories.deleteAll()
    const delBlog = blogs_repositories.deleteAll()
   // console.log(delBlog,"del blog true or false")
   // console.log(delPost,"del post true or false")

    if(delBlog && delPost) {
       //console.log("delete all")
        res.sendStatus(204)
    }

})