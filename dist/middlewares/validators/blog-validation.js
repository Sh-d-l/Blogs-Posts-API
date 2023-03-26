"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostValidation = exports.createPostValidation = exports.updateBlogValidation = exports.createBlogValidation = void 0;
const express_validator_1 = require("express-validator");
const input_validation_middleware_1 = require("./input-validation.middleware");
const blog_API_repositories_1 = require("../../blog_API-repositories/blog_API-repositories");
const nameValidation = (0, express_validator_1.body)('name').isString().trim().notEmpty().isLength({ min: 1, max: 15 });
let descriptionValidation = (0, express_validator_1.body)('description').isString().trim().notEmpty().isLength({ min: 1, max: 500 });
const websiteUrlValidation = (0, express_validator_1.body)('websiteUrl').isString().trim().notEmpty().isLength({ max: 100 });
const titleValidation = (0, express_validator_1.body)('title').trim().isLength({ min: 1, max: 30 }).isString();
const shortDescriptionValidation = (0, express_validator_1.body)('shortDescription').trim().isString().isLength({ min: 1, max: 100 });
const contentValidation = (0, express_validator_1.body)('content').trim().isString().isLength({ max: 1000 });
const blogIdValidation = (0, express_validator_1.body)('blogId').isString().trim().notEmpty().custom((val, { req }) => {
    const blog = blog_API_repositories_1.blogs_repositories.getBlog_ID(val);
    if (!blog)
        return false;
    req.blog = blog;
    return true;
});
exports.createBlogValidation = [
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    input_validation_middleware_1.inputValidator
];
exports.updateBlogValidation = [
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    input_validation_middleware_1.inputValidator
];
exports.createPostValidation = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    input_validation_middleware_1.inputValidator
];
exports.updatePostValidation = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    input_validation_middleware_1.inputValidator
];
//# sourceMappingURL=blog-validation.js.map