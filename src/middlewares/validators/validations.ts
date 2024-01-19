import {body} from "express-validator";
import {inputValidator} from "./input-validation.middleware";
//import {blogs_repositories} from "../../repositories/blog_API-repositories-db";
import {CreateUsersWithConfirmationCode} from "../../types/types";
import {UsersRepoDb} from "../../repositories/users_API-repositories-db";
import { container} from "../../composition-root";
import {BlogsRepo} from "../../repositories/blog_API-repositories-db";
import {PostsRepo} from "../../repositories/post_API-repositories-db";
//import {usersRepoDb} from "../../repositories/users_API-repositories-db";
const websiteUrlPattern =
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
export const loginPattern = /^[a-zA-Z0-9_-]*$/;
export const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
const blogsRepo = container.resolve(BlogsRepo)
const usersRepo = container.resolve(UsersRepoDb)
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
const likeStatusValidation = body("likeStatus")
    .isString()
    .trim()
    .notEmpty()
    .isIn(['Like',  'Dislike', 'None'])

const blogIdBodyValidation = body('blogId').custom(async (val) => {
    const blog = await blogsRepo.getBlogID(val)
    if (!blog) {
        throw new Error("BlogId not exist")
    }
    return true;
})

    const registeredUserEmailValidation = body("email").custom(async (email) => {
        const user = await usersRepo.findUserByLoginOrEmail(email)
        if (user) {
            throw new Error("User already registered")
        }
        return true
    })
    const registeredUserLoginValidation = body("login").custom(async (login) => {
        const user = await usersRepo.findUserByLoginOrEmail(login)
        if (user) {
            throw new Error("User already registered")
        }
        return true
    })

    const
    registeredUserIsConfirmedValidation = body("code").custom(async (code) => {
        const user: CreateUsersWithConfirmationCode | null = await usersRepo.findUserByCode(code)
        if (user && user.emailConfirmation.isConfirmed) {
            throw new Error("User already registered")
        }
        return true
    })
    const
    expirationTimeValidation = body("code").custom(async (code) => {
        const user = await usersRepo.findUserByCode(code)
        if (user && user.emailConfirmation.expirationTime < new Date()) {
            throw new Error("Code expired")
        }
        return true
    })
    const
    resendingMailValidation = body("email").custom(async (email) => {
        const user: CreateUsersWithConfirmationCode | null = await usersRepo.findUserByEmail(email)
        if (!user) {
            throw new Error("User not found")
        }
        return true
    })

    const
    registeredUserIsConfirmedResendingMailValidation = body("email").custom(async (email) => {
        const user: CreateUsersWithConfirmationCode | null = await usersRepo.findUserByEmail(email)
        if (user && user.emailConfirmation.isConfirmed) {
            throw new Error("User already registered")
        }
        return true
    })
    const
    expirationTimeResendingEmailValidation = body("email").custom(async (email) => {
        const user = await usersRepo.findUserByEmail(email)
        if (user && user.emailConfirmation.expirationTime < new Date()) {
            throw new Error("Code expired")
        }
        return true
    })
    const
    recoveryCodeForNewPasswordValidation = body("recoveryCode").custom(async (recoveryCode) => {
        const recoveryCodeObject = await usersRepo.findRecoveryCodeObjectByRecoveryCode(recoveryCode)
        if (!recoveryCodeObject) {
            throw new Error("incorrect recoveryCode")
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
    .isString()
    .withMessage("Not string")
    .trim()
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

const newPasswordValidation = body("newPassword")
    .exists()
    .withMessage("Not exists")
    .trim()
    .isString()
    .withMessage("Not string")
    .isLength({min: 6, max: 20})
    .withMessage("less 6 or more 20")

const recoveryCodeTypeValidation = body("recoveryCode")
    .exists()
    .withMessage("Not exists")
    .isString()
    .withMessage("Not string")
    .trim()


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
    registeredUserEmailValidation,
    registeredUserLoginValidation,
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidator
]
export const confirmCodeValidation = [
    confirmationCodeValidation,
    expirationTimeValidation,
    registeredUserIsConfirmedValidation,
    inputValidator
]
export const resendingEmailValidation = [
    emailValidation,
    inputValidator
]
export const createNewUserSuperAdminValidation = [
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidator
]
export const mailValidation =[
    emailValidation,
    inputValidator
]

export const newPasswordValidationArray = [
    newPasswordValidation,
    recoveryCodeTypeValidation,
    recoveryCodeForNewPasswordValidation,
    inputValidator
]
export const likeStatusValidationArray = [
    likeStatusValidation,
    inputValidator
]


