"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delAll_Router = void 0;
const blog_API_repositories_1 = require("../blog_API-repositories/blog_API-repositories");
const post_API_repositories_1 = require("../post_API-repositories/post_API-repositories");
const express_1 = require("express");
exports.delAll_Router = (0, express_1.Router)({});
exports.delAll_Router.delete('/', (req, res) => {
    const delPost = post_API_repositories_1.posts_repositories.deleteAll();
    const delBlog = blog_API_repositories_1.blogs_repositories.deleteAll();
    // console.log(delBlog,"del blog true or false")
    // console.log(delPost,"del post true or false")
    if (delBlog && delPost) {
        //console.log("delete all")
        res.sendStatus(204);
    }
});
//# sourceMappingURL=deleteAll.js.map