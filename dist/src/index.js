"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
const port = 3000;
const blog_API_router_1 = require("./blog_API-router/blog_API-router");
const post_API_router_1 = require("./post_API-router/post_API-router");
const post_API_repositories_1 = require("./post_API-repositories/post_API-repositories");
const blog_API_repositories_1 = require("./blog_API-repositories/blog_API-repositories");
exports.app.use("/blogs", blog_API_router_1.blog_Router);
exports.app.use("/posts", post_API_router_1.post_Router);
exports.app.delete("/testing/all-data", (req, res) => {
    const delPost = post_API_repositories_1.posts_repositories.deleteAll();
    const delBlog = blog_API_repositories_1.blogs_repositories.deleteAll();
    if (delBlog && delPost) {
        res.sendStatus(204);
    }
});
exports.app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
//# sourceMappingURL=index.js.map