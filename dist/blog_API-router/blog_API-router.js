"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delBlog_Router = exports.blog_Router = void 0;
const express_1 = require("express");
const blog_API_repositories_1 = require("../blog_API-repositories/blog_API-repositories");
const basic_auth_1 = require("../auth/basic_auth");
const blog_validation_1 = require("../middlewares/validators/blog-validation");
exports.blog_Router = (0, express_1.Router)({});
exports.delBlog_Router = (0, express_1.Router)({});
exports.blog_Router.get('/', (req, res) => {
    const get_Blog = blog_API_repositories_1.blogs_repositories.getBlog;
    res.status(200).send(get_Blog());
});
exports.blog_Router.post('/', basic_auth_1.basicAuth, ...blog_validation_1.createBlogValidation, (req, res) => {
    const post_Blog = blog_API_repositories_1.blogs_repositories.createBlog(req.body.name, req.body.description, req.body.websiteUrl);
    //console.log(post_Blog, "post_Blog create blog, return blog")
    res.status(201).send(post_Blog);
});
exports.blog_Router.get('/:id', (req, res) => {
    const get_BlogId = blog_API_repositories_1.blogs_repositories.getBlog_ID(req.params.id);
    if (get_BlogId) {
        res.status(200).send(get_BlogId);
    }
    else {
        res.sendStatus(400);
    }
});
exports.blog_Router.put('/:id', basic_auth_1.basicAuth, ...blog_validation_1.updateBlogValidation, (req, res) => {
    //console.log(req.params.id, 'id from blog update')
    const put_Blog = blog_API_repositories_1.blogs_repositories.updateBlog(req.params.id, req.body.name, req.body.description, req.body.websiteUrl);
    //console.log(put_Blog, ' result if we want update blog')
    if (put_Blog) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
exports.blog_Router.delete('/:id', basic_auth_1.basicAuth, (req, res) => {
    const del_BlogID = blog_API_repositories_1.blogs_repositories.deleteID(req.params.id);
    if (del_BlogID) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
//# sourceMappingURL=blog_API-router.js.map