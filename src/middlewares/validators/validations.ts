import {body} from "express-validator";
import {inputValidator} from "./input-validation.middleware";
import {blogs_repositories} from "../../blog_API-repositories/blog_API-repositories-db";
import {authRepoDB} from "../../auth_API-repositories/authRepoDB";
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
    if (!blog) {
        throw new Error("BlogId not exist")
    }
    return true;
})
const previouslyRegisteredUser = body("email").custom(async (val) => {
    const user = await authRepoDB.findUserByEmail(val)
    if(user) {
        throw new Error("User already registered")
    }
    return true
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
    .withMessage("less 6 or more 20")

const emailValidation = body("email")
    .exists()
    .withMessage("Not exists")
    .trim()
    .isString()
    .withMessage("Not string")
    .matches(emailPattern)
    .withMessage("Does not match pattern email")

const commentValidation = body("content")
    .exists()
    .withMessage("Not exists")
    .trim()
    .isString()
    .withMessage("Not string")
    .isLength({min: 20, max: 300})
    .withMessage("less 20 or more 300")

const confirmationCodeValidation = body ("code")
    .exists()
    .withMessage("Not exists")
    .trim()
    .isString()
    .withMessage("Not string")

export const createCommentValidation = [
    commentValidation,
    inputValidator
]
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
export const createNewUserValidation = [
    previouslyRegisteredUser,
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidator
]
export const confirmCodeValidation = [
    confirmationCodeValidation,
    inputValidator
]
export const userEmailValidation = [
    emailValidation,
    inputValidator
]

