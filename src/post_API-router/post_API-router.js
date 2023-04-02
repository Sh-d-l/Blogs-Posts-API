"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.post_Router = void 0;
const express_1 = require("express");
const post_API_repositories_1 = require("../post_API-repositories/post_API-repositories");
const basic_auth_1 = require("../auth/basic_auth");
const blog_validation_1 = require("../middlewares/validators/blog-validation");
exports.post_Router = (0, express_1.Router)({});
exports.post_Router.get('/', (req, res) => {
    const get_Post = post_API_repositories_1.posts_repositories.getPost;
    res.status(200).send(get_Post());
});
exports.post_Router.post('/', basic_auth_1.basicAuth, ...blog_validation_1.createPostValidation, (req, res) => {
    const post_Post = post_API_repositories_1.posts_repositories.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
    res.status(201).send(post_Post);
});
exports.post_Router.get('/:id', (req, res) => {
    const get_PostId = post_API_repositories_1.posts_repositories.getPost_ID(req.params.id);
    if (get_PostId) {
        res.status(200).send(get_PostId);
    }
    else {
        res.sendStatus(400);
    }
});
exports.post_Router.put('/:id', basic_auth_1.basicAuth, ...blog_validation_1.updatePostValidation, (req, res) => {
    const put_Post = post_API_repositories_1.posts_repositories.updatePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
    if (put_Post) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
exports.post_Router.delete('/:id', basic_auth_1.basicAuth, (req, res) => {
    const del_PostID = post_API_repositories_1.posts_repositories.deleteID(req.params.id);
    if (del_PostID) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
