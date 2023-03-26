"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.posts_repositories = void 0;
const blog_API_repositories_1 = require("../blog_API-repositories/blog_API-repositories");
const posts = [];
exports.posts_repositories = {
    getPost() {
        return posts;
    },
    createPost(title, shortDescription, content, blogId) {
        const blog = blog_API_repositories_1.blogs_repositories.getBlog_ID(blogId);
        if (!blog)
            return null;
        const time = new Date().toISOString();
        const newPost = {
            id: time,
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blog.id,
            blogName: blog.name
        };
        posts.push(newPost);
        return posts;
    },
    getPost_ID(id) {
        return posts.find((elem) => elem.id === id);
    },
    updatePost(id, title, shortDescription, content, blogId) {
        let findID = posts.find((elem) => elem.id === id);
        if (findID) {
            findID.title = title;
            findID.shortDescription = shortDescription;
            findID.content = content;
            findID.blogId = blogId;
            return true;
        }
        else {
            return false;
        }
    },
    deleteID(id) {
        let found_blog_by_ID = posts.filter((elem) => elem.id === id);
        if (found_blog_by_ID.length > 0) {
            posts.splice(posts.indexOf(found_blog_by_ID[0]), 1);
            return true;
        }
        else {
            return false;
        }
    },
    deleteAll() {
        posts.splice(0, posts.length);
        return true;
    }
};
//# sourceMappingURL=post_API-repositories.js.map