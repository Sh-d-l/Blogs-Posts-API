import {body} from "express-validator";
import {inputValidator} from "./input-validation.middleware";
import {blogs_repositories} from "../../blog_API-repositories/blog_API-repositories";


const nameValidation = body('name').isString().trim().notEmpty().isLength({min: 1, max: 15})
let descriptionValidation = body('description').isString().trim().notEmpty().isLength({min: 1, max: 500})
const websiteUrlValidation =  body('websiteUrl').isString().trim().notEmpty().isLength({max: 100})

const titleValidation = body('title').trim().isLength({min: 1, max: 30}).isString()
const shortDescriptionValidation =  body('shortDescription').trim().isString().isLength({min: 1, max: 100})
const contentValidation = body('content').trim().isString().isLength({max: 1000})
const blogIdValidation = body('blogId').isString().trim().notEmpty().custom((val, {req}) => {
        const blog = blogs_repositories.getBlog_ID(val)
        if (!blog) return false
        req.blog = blog
        return true
    })

export const createBlogValidation = [
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidator
]

export const updateBlogValidation = [
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidator
]

export const createPostValidation = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidator
]

export const updatePostValidation =[
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidator
]