import {body} from "express-validator";
import {inputValidator} from "./input-validation.middleware";
import {blogs_repositories} from "../../blog_API-repositories/blog_API-repositories-db";

const websiteUrlPattern =
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
export const loginPattern = /^[a-zA-Z0-9_-]*$/;
export const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

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
    .isLength({min: 1, max: 100,})
    .withMessage(
        "Website URL length must be more than 0 and less than or equal to 100 symbols"
    )
    .matches(websiteUrlPattern)
    .withMessage("Website URL must be in correct format")

const titleValidation = body('title')
    .isString()
    .trim()
    .isLength({min: 1, max: 30})
    .notEmpty()
const shortDescriptionValidation = body('shortDescription')
    .isString()
    .trim()
    .isLength({min: 1, max: 100})
const contentValidation = body('content')
    .isString()
    .trim()
    .isLength({max: 1000})
    .notEmpty()
const blogIdBodyValidation = body('blogId').custom(async (val) => {
    const blog = await blogs_repositories.getBlogID(val)
    console.log(blog)
    if (!blog) {
        throw new Error("BlogId not exist")
    }
    return true;
})

const loginValidation = body("login")
    .exists()
    .withMessage("Not exists")
    .isString()
    .withMessage("Not string")
    .trim()
    .isLength({min: 3, max: 10})
    .withMessage("less 3 or more 10")
    .matches(loginPattern)
    .withMessage("Does not match pattern login")

const passwordValidation = body("password")
    .exists()
    .withMessage("Not exists")
    .trim()
    .isString()
    .withMessage("Not string")
    .isLength({min: 6, max: 20})
    .withMessage("less 3 or more 10")

const emailValidation = body("email")
    .exists()
    .withMessage("Not exists")
    .trim()
    .isString()
    .withMessage("Not string")
    .matches(emailPattern)
    .withMessage("Does not match pattern email")


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
    blogIdBodyValidation,
    inputValidator
]

export const updatePostValidation = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdBodyValidation,
    inputValidator
]
export const createPostByBlogIDValidation = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidator
]
export const createNewUser = [
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidator
]
