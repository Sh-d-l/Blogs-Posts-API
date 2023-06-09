import {body, cookie} from "express-validator";
import {inputValidator} from "./input-validation.middleware";
import {blogs_repositories} from "../../repositories/blog_API-repositories-db";
import {TUsersWithHashEmailDb} from "../../types/types";
import {usersRepoDb} from "../../repositories/users_API-repositories-db";
import {jwtService} from "../../application/jwt-service";
import {repoRefreshToken} from "../../repositories/revokedRefreshToken";
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
const registeredUserEmailValidation = body("email").custom(async (email) => {
    const user = await usersRepoDb.findUserByLoginOrEmail(email)
    if(user) {
        throw new Error("User already registered")
    }
    return true
})
const registeredUserLoginValidation = body("login").custom(async (login) => {
    const user = await usersRepoDb.findUserByLoginOrEmail(login)
    if(user) {
        throw new Error("User already registered")
    }
    return true
})
const correctConfirmationCodeValidation = body("code").custom(async (code) => {
    const user:TUsersWithHashEmailDb | null  = await usersRepoDb.findUserByCode(code)
    if(!user) {
        throw new Error("User not found")
    }
    return true
})
const registeredUserIsConfirmedValidation = body("code").custom(async (code) => {
    const user:TUsersWithHashEmailDb | null  = await usersRepoDb.findUserByCode(code)
    if(user && user.emailConfirmation.isConfirmed) {
        throw new Error("User already registered")
    }
    return true
})
const expirationTimeValidation = body("code").custom(async (code) => {
    const user = await usersRepoDb.findUserByCode(code)
    if (user && user.emailConfirmation.expirationTime < new Date()) {
        throw new Error("Code expired")
    }
    return true
})
const resendingMailValidation = body("email").custom(async (email) => {
    const user:TUsersWithHashEmailDb | null  = await usersRepoDb.findUserByEmail(email)
    if(!user ) {
        throw new Error("User not found")
    }
    return true
})

const registeredUserIsConfirmedResendingMailValidation = body("email").custom(async (email) => {
    const user:TUsersWithHashEmailDb | null  = await usersRepoDb.findUserByEmail(email)
    if(user && user.emailConfirmation.isConfirmed) {
        throw new Error("User already registered")
    }
    return true
})
const expirationTimeResendingEmailValidation = body("email").custom(async (email) => {
    const user = await usersRepoDb.findUserByEmail(email)
    if (user && user.emailConfirmation.expirationTime < new Date()) {
        throw new Error("Code expired")
    }
    return true
})
// const refreshTokenValidation = cookie("refreshToken").custom(async (refreshToken) => {
//     if (!refreshToken) {
//         throw new Error("refresh token does not exist")
//     }
//     const userId = await jwtService.getUserIdByToken(refreshToken)
//     if (!userId) {
//         throw new Error("refresh token expired")
//     }
//     const refreshTokenObject = {
//         refreshToken:refreshToken
//     }
//     const checkBlackList = await repoRefreshToken.blacklistedRefreshTokenSearch(refreshTokenObject)
//     if(checkBlackList) {
//         throw new Error("refresh token")
//     }
//     return true
// })

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
    registeredUserEmailValidation,
    registeredUserLoginValidation,
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidator
]
export const confirmCodeValidation = [
    confirmationCodeValidation,
    correctConfirmationCodeValidation,
    expirationTimeValidation,
    registeredUserIsConfirmedValidation,
    inputValidator
]
export const resendingEmailValidation = [
    resendingMailValidation,
    registeredUserIsConfirmedResendingMailValidation,
    expirationTimeResendingEmailValidation,
    emailValidation,
    inputValidator
]
export const createNewUserSuperAdminValidation = [
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidator
]
// export const refreshTokenFromCookieValidation = [
//     refreshTokenValidation,
//     inputValidator
// ]

