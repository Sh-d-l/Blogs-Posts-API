import {body} from "express-validator";
import {inputValidator} from "./input-validation.middleware";
import {blogs_repositories} from "../../blog_API-repositories/blog_API-repositories-db";
const websiteUrlPattern =
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

const nameValidation = body('name')
    .isString()
    .trim()
    .notEmpty()
    .isLength({min: 1, max: 15})
let descriptionValidation = body('description')
    .isString()
    .trim()
    .notEmpty()
    .isLength({min: 1, max: 500})
const websiteUrlValidation = body("websiteUrl")
    .exists()
    .withMessage("Website URL is required")
    .isString()
    .withMessage("Type of Website URL must be string")
    .trim()
    .isLength({min: 1,max: 100,})
    .withMessage(
        "Website URL length must be more than 0 and less than or equal to 100 symbols"
    )
    .matches(websiteUrlPattern)
    .withMessage("Website URL must be in correct format")

const titleValidation = body('title')
    .trim()
    .isLength({min: 1, max: 30})
    .isString()
    .notEmpty()
const shortDescriptionValidation =  body('shortDescription')
    .trim()
    .isString()
    .isLength({min: 1, max: 100})
const contentValidation = body('content')
    .trim()
    .isLength({max: 1000})
    .isString()
    .notEmpty()
const blogIdValidation = body('blogId').custom(async (val) => {
        const blog = await blogs_repositories.getBlogID(val)
        if(!blog) {
            throw new Error("BlogId not exist")
        }
        return true;
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