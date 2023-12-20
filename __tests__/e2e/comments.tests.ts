import request from "supertest"
import {app} from "../../src/settings";
import {
    blogDescription,
    blogName,
    blogWebsiteUrl,
    foundBlogById, postContent, postShortDescription,
    postTitle,
    urlBlogs,
    urlPosts
} from "../../test_constanse/blogs.constans";
import {incorrectBasicAuthName, incorrectBasicAuthPass, loginAuth, passAuth} from
        "../../test_constanse/authUsers.constans";
import {
    emailUser,
    loginUser,
    passUser,
    urlUser,
    urlCreateUserWithEmail,
    urlResendingEmail,
    urlConfirmationCode,
    loginUser2,
    passUser2,
    emailUser2,
    loginUser3, passUser3, emailUser3, loginUser4, passUser4, emailUser4
} from "../../test_constanse/user.constans";
import {urlAuth} from "../../test_constanse/auth.constans";
import {
    content,
    dislikeStatus,
    incorrectLikeStatus,
    lessContentLength,
    likeStatus,
    moreContentLength,
    urlComments,
    urlLikeStatus
} from
        "../../test_constanse/comments.constans";
import mongoose from "mongoose";
import {CreateUserWithMailModel, mongoURI} from "../../src/mongoDB/db";
import {CreateUsersWithConfirmationCode} from "../../src/types/types";

describe("comments", () => {
    let tokensUser1: any;
    let tokensUser2:any;
    let tokensUser3: any;
    let tokensUser4: any;
    beforeAll(async () => {
        /* Connecting to the database. */
        await mongoose.connect(mongoURI)
        await request(app)
            .del("/testing/all-data")
            .expect(204)
    })
    /*----------------------------create user 1---------------------------------*/

    it("create new user, should return 204", async () => {
        await request(app)
            .post(urlCreateUserWithEmail)
            .send({
                    login: loginUser,
                    password: passUser,
                    email: emailUser,
                }
            )
            .expect(204)
    })

    /*--------------------------confirmation of registration user 1--------------------*/

    it("confirmationCode success, should return 204", async () => {
        const user: CreateUsersWithConfirmationCode | null = await CreateUserWithMailModel.findOne({email: emailUser})

        if (user) {
            await request(app)
                .post(urlConfirmationCode)
                .send({code: user.emailConfirmation.confirmationCode})
                .expect(204)
        }
    })

    /*----------------------------login user 1-------------------------------------------*/

    it("auth , should return 200 with tokens", async () => {
        tokensUser1 = await request(app)
            .post(urlAuth)
            .set('X-Forwarded-For', '::1')
            .set('user-agent', "some spoofed agent")
            .send({
                loginOrEmail: emailUser,
                password: passUser,
            })
            .expect(200)
        //console.log(tokens.headers['set-cookie'])
        expect(tokensUser1.body).toEqual({
            accessToken: expect.any(String)
        })
        //console.log(tokensUser1.body.accessToken, "tokensUser1.body.accessToken")
        expect(tokensUser1.headers['set-cookie']).toEqual([expect.any(String)])
        expect.setState({accessTokenUser1: tokensUser1.body.accessToken})
    })

    /*---------------------------------create user 2---------------------------------------*/

    it("create user 2", async () => {
        const user2 = await request(app)
            .post(urlCreateUserWithEmail)
            .send({
                    login: loginUser2,
                    password: passUser2,
                    email: emailUser2,
                }
            )
            .expect(204)
    })

    /*--------------------------confirmation of registration user 2--------------------*/

    it("confirmationCode user 2 success, should return 204", async () => {
        const user: CreateUsersWithConfirmationCode | null = await CreateUserWithMailModel.findOne({login: loginUser2})

        if (user) {
            await request(app)
                .post(urlConfirmationCode)
                .send({code: user.emailConfirmation.confirmationCode})
                .expect(204)
        }
    })
    /*----------------------------login user 2-------------------------------------------*/

    it("auth user 2, should return 200 with tokens", async () => {
        const tokensUser2 = await request(app)
            .post(urlAuth)
            .set('X-Forwarded-For', '::1')
            .set('user-agent', "some spoofed agent2")
            .send({
                loginOrEmail: loginUser2,
                password: passUser2,
            })
            .expect(200)
        //console.log(tokens.headers['set-cookie'])
        expect(tokensUser2.body).toEqual({
            accessToken: expect.any(String)
        })
        //console.log(tokensUser2.body.accessToken, "tokensUser2.body.accessToken")
        expect(tokensUser2.headers['set-cookie']).toEqual([expect.any(String)])
        expect.setState({accessTokenUser2: tokensUser2.body.accessToken})
    })

    /*---------------------------------create user 3---------------------------------------*/

    it("create user 3", async () => {
        const user3  = await request(app)
            .post(urlCreateUserWithEmail)
            .send({
                    login: loginUser3,
                    password: passUser3,
                    email: emailUser3,
                }
            )
            .expect(204)

    })
    /*--------------------------confirmation of registration user 3--------------------*/

    it("confirmationCode user 3 success, should return 204", async () => {
        const user: CreateUsersWithConfirmationCode | null = await CreateUserWithMailModel.findOne({login: loginUser3})

        if (user) {
            await request(app)
                .post(urlConfirmationCode)
                .send({code: user.emailConfirmation.confirmationCode})
                .expect(204)
        }
    })
    /*----------------------------login user 3-------------------------------------------*/

    it("auth user 3, should return 200 with tokens", async () => {
        const tokensUser3 = await request(app)
            .post(urlAuth)
            .set('X-Forwarded-For', '::1')
            .set('user-agent', "some spoofed agent3")
            .send({
                loginOrEmail: loginUser3,
                password: passUser3,
            })
            .expect(200)
        //console.log(tokens.headers['set-cookie'])
        expect(tokensUser3.body).toEqual({
            accessToken: expect.any(String)
        })
        expect(tokensUser3.headers['set-cookie']).toEqual([expect.any(String)])
        expect.setState({accessTokenUser3: tokensUser3.body.accessToken})
    })

    /*---------------------------------create user 4---------------------------------------*/

    it("create user 4", async () => {
        const user4  = await request(app)
            .post(urlCreateUserWithEmail)
            .send({
                    login: loginUser4,
                    password: passUser4,
                    email: emailUser4,
                }
            )
            .expect(204)

    })
    /*--------------------------confirmation of registration user 4--------------------*/

    it("confirmationCode user 4 success, should return 204", async () => {
        const user: CreateUsersWithConfirmationCode | null = await CreateUserWithMailModel.findOne({login: loginUser4})

        if (user) {
            await request(app)
                .post(urlConfirmationCode)
                .send({code: user.emailConfirmation.confirmationCode})
                .expect(204)
        }
    })
    /*----------------------------login user 4-------------------------------------------*/

    it("auth user 4, should return 200 with tokens", async () => {
        const tokensUser4 = await request(app)
            .post(urlAuth)
            .set('X-Forwarded-For', '::1')
            .set('user-agent', "some spoofed agent4")
            .send({
                loginOrEmail: loginUser4,
                password: passUser4,
            })
            .expect(200)
        //console.log(tokens.headers['set-cookie'])
        expect(tokensUser4.body).toEqual({
            accessToken: expect.any(String)
        })
        expect(tokensUser4.headers['set-cookie']).toEqual([expect.any(String)])
        expect.setState({accessTokenUser4: tokensUser4.body.accessToken})
    })

    /*----------------------------create blog --------------------------------------*/
    it("create blog, should return 201 and {}", async () => {
        await request(app)
            .post(urlBlogs)
            .auth(loginAuth, passAuth)
            .send({
                name: blogName,
                description: blogDescription,
                websiteUrl: blogWebsiteUrl,
            })
            .expect(201)
    });

    /*---------------------create post by blogId-------------------------*/

    it("create post, should return 401 if unauthorized", async () => {
        await request(app)
            .post(urlPosts)
            .auth(incorrectBasicAuthName, incorrectBasicAuthPass)
            .expect(401)
    })
    it("create post, should return 201 if success", async () => {
        const blogId = await foundBlogById()
        const post = await request(app)
            .post(urlPosts)
            .auth(loginAuth, passAuth)
            .send({
                title: postTitle,
                shortDescription: postShortDescription,
                content: postContent,
                blogId
            })
            .expect(201)
        expect(post.body).toEqual({
            id: expect.any(String),
            title: postTitle,
            shortDescription: postShortDescription,
            content: postContent,
            blogId,
            blogName: expect.any(String),
            createdAt: expect.any(String),
        })
        expect.setState({post: post.body})
    })

    /*------------------------create 6 comments  by PostId------------------------------*/

    // it("create new user, should return 201 and newUser", async () => {
    //     const newUser = await request(app)
    //         .post(urlUser)
    //         .auth(tokens.body.accessToken, {type:"bearer"})
    //         .send({
    //                 login: loginUser,
    //                 password: passUser,
    //                 email: emailUser,
    //             }
    //         )
    //         .expect(201)
    //     expect(newUser.body).toEqual({
    //         id: expect.any(String),
    //         login: loginUser,
    //         email: emailUser,
    //         createdAt: expect.any(String),
    //     })
    //     expect.setState({user: {...newUser.body, password: passUser}})
    // })
    // it("auth with correct login and pass, should return 200 with token", async () => {
    //     const {user} = expect.getState()
    //     const token = await  request(app)
    //         .post(urlAuth)
    //         .send({
    //             loginOrEmail: user.login,
    //             password: user.password
    //         })
    //         .expect(200)
    //
    //     expect(token.body.accessToken).toBeDefined()
    //     expect(token.body.accessToken).toEqual(expect.any(String))
    //     expect.setState({token: token.body.accessToken})
    // })
    it("create comment 1 by postId, should return 201 and object", async () => {
        const {post, /*token*/} = expect.getState()
        const postId = post.id
        const url = urlPosts + postId + urlComments

        const comment = await request(app)
            .post(url)
            .auth(tokensUser1.body.accessToken, {type: 'bearer'})
            .send({
                content
            })
            .expect(201)
        expect(comment.body).toEqual({
            id: expect.any(String),
            content,
            commentatorInfo: {
                userId: expect.any(String),
                userLogin: expect.any(String)
            },
            createdAt: expect.any(String),
            likesInfo: {
                likesCount: expect.any(Number),
                dislikesCount: expect.any(Number),
                myStatus: expect.any(String)
            }
        })

        expect.setState({comment1: comment.body})
    })

    it("create comment 2 by postId, should return 201 and object", async () => {
        const {post, /*token*/} = expect.getState()
        const postId = post.id
        const url = urlPosts + postId + urlComments

        const comment = await request(app)
            .post(url)
            .auth(tokensUser1.body.accessToken, {type: 'bearer'})
            .send({
                content
            })
            .expect(201)
        expect(comment.body).toEqual({
            id: expect.any(String),
            content,
            commentatorInfo: {
                userId: expect.any(String),
                userLogin: expect.any(String)
            },
            createdAt: expect.any(String),
            likesInfo: {
                likesCount: expect.any(Number),
                dislikesCount: expect.any(Number),
                myStatus: expect.any(String)
            }
        })

        expect.setState({comment2: comment.body})
    })

    it("create comment 3 by postId, should return 201 and object", async () => {
        const {post, /*token*/} = expect.getState()
        const postId = post.id
        const url = urlPosts + postId + urlComments

        const comment = await request(app)
            .post(url)
            .auth(tokensUser1.body.accessToken, {type: 'bearer'})
            .send({
                content
            })
            .expect(201)
        expect(comment.body).toEqual({
            id: expect.any(String),
            content,
            commentatorInfo: {
                userId: expect.any(String),
                userLogin: expect.any(String)
            },
            createdAt: expect.any(String),
            likesInfo: {
                likesCount: expect.any(Number),
                dislikesCount: expect.any(Number),
                myStatus: expect.any(String)
            }
        })

        expect.setState({comment3: comment.body})
    })

    it("create comment 4 by postId, should return 201 and object", async () => {
        const {post, /*token*/} = expect.getState()
        const postId = post.id
        const url = urlPosts + postId + urlComments

        const comment = await request(app)
            .post(url)
            .auth(tokensUser1.body.accessToken, {type: 'bearer'})
            .send({
                content
            })
            .expect(201)
        expect(comment.body).toEqual({
            id: expect.any(String),
            content,
            commentatorInfo: {
                userId: expect.any(String),
                userLogin: expect.any(String)
            },
            createdAt: expect.any(String),
            likesInfo: {
                likesCount: expect.any(Number),
                dislikesCount: expect.any(Number),
                myStatus: expect.any(String)
            }
        })

        expect.setState({comment4: comment.body})
    })

    it("create comment 5 by postId, should return 201 and object", async () => {
        const {post, /*token*/} = expect.getState()
        const postId = post.id
        const url = urlPosts + postId + urlComments

        const comment = await request(app)
            .post(url)
            .auth(tokensUser1.body.accessToken, {type: 'bearer'})
            .send({
                content
            })
            .expect(201)
        expect(comment.body).toEqual({
            id: expect.any(String),
            content,
            commentatorInfo: {
                userId: expect.any(String),
                userLogin: expect.any(String)
            },
            createdAt: expect.any(String),
            likesInfo: {
                likesCount: expect.any(Number),
                dislikesCount: expect.any(Number),
                myStatus: expect.any(String)
            }
        })

        expect.setState({comment5: comment.body})
    })

    it("create comment 6 by postId, should return 201 and object", async () => {
        const {post, /*token*/} = expect.getState()
        const postId = post.id
        const url = urlPosts + postId + urlComments

        const comment = await request(app)
            .post(url)
            .auth(tokensUser1.body.accessToken, {type: 'bearer'})
            .send({
                content
            })
            .expect(201)
        expect(comment.body).toEqual({
            id: expect.any(String),
            content,
            commentatorInfo: {
                userId: expect.any(String),
                userLogin: expect.any(String)
            },
            createdAt: expect.any(String),
            likesInfo: {
                likesCount: expect.any(Number),
                dislikesCount: expect.any(Number),
                myStatus: expect.any(String)
            }
        })

        expect.setState({comment6: comment.body})
    })

    /*---------------------------------like comment 1 by user1 and user 2-----------------------------*/
    it("like comment 1 by user1, should return 204", async () => {
        const {comment1, accessTokenUser1} = expect.getState()
        const commentId = comment1.id
        const url = urlComments + commentId + urlLikeStatus
        const likeDislikeObject = await request(app)
            .put(url)
            .auth(tokensUser1.body.accessToken, {type: "bearer"})
            .send({likeStatus})
            .expect(204)
    })

    it("like comment 1 by user2, should return 204", async () => {
        const {comment1, accessTokenUser2} = expect.getState()
        const commentId = comment1.id
        const url = urlComments + commentId + urlLikeStatus
        const likeDislikeObject = await request(app)
            .put(url)
            .auth(accessTokenUser2, {type: "bearer"})
            .send({likeStatus})
            .expect(204)
    })
    /*-------------------------------like comment 2 by user 2 and user 3---------------------------*/
    it("like comment 2 by user 2, should return 204", async () => {
        const {comment2, accessTokenUser2} = expect.getState()
        const commentId = comment2.id
        const url = urlComments + commentId + urlLikeStatus
        const likeDislikeObject = await request(app)
            .put(url)
            .auth(accessTokenUser2, {type: "bearer"})
            .send({likeStatus})
            .expect(204)
    })

    it("like comment 2 by user 3, should return 204", async () => {
        const {comment1, accessTokenUser3} = expect.getState()
        const commentId = comment1.id
        const url = urlComments + commentId + urlLikeStatus
        const likeDislikeObject = await request(app)
            .put(url)
            .auth(accessTokenUser3, {type: "bearer"})
            .send({likeStatus})
            .expect(204)
    })

    /*-------------------------------dislike comment 3 by user 1-----------------------------------*/

    it("dislike comment 3 by user 1, should return 204", async () => {
        const {comment3, accessTokenUser1} = expect.getState()
        const commentId = comment3.id
        const url = urlComments + commentId + urlLikeStatus
        const likeDislikeObject = await request(app)
            .put(url)
            .auth(accessTokenUser1, {type: "bearer"})
            .send({dislikeStatus})
            .expect(204)
    })

    /*------------------------------like comment 4 by user 1 and user 4 and user 2 and user 3------*/

    it("like comment 4 by user 1, should return 204", async () => {
        const {comment4, accessTokenUser1} = expect.getState()
        const commentId = comment4.id
        const url = urlComments + commentId + urlLikeStatus
        const likeDislikeObject = await request(app)
            .put(url)
            .auth(accessTokenUser1, {type: "bearer"})
            .send({likeStatus})
            .expect(204)
    })
    it("like comment 4 by user 4, should return 204", async () => {
        const {comment4, accessTokenUser4} = expect.getState()
        const commentId = comment4.id
        const url = urlComments + commentId + urlLikeStatus
        const likeDislikeObject = await request(app)
            .put(url)
            .auth(accessTokenUser4, {type: "bearer"})
            .send({likeStatus})
            .expect(204)
    })
    it("like comment 4 by user 2, should return 204", async () => {
        const {comment4, accessTokenUser2} = expect.getState()
        const commentId = comment4.id
        const url = urlComments + commentId + urlLikeStatus
        const likeDislikeObject = await request(app)
            .put(url)
            .auth(accessTokenUser2, {type: "bearer"})
            .send({likeStatus})
            .expect(204)
    })
    it("like comment 4 by user 3, should return 204", async () => {
        const {comment4, accessTokenUser3} = expect.getState()
        const commentId = comment4.id
        const url = urlComments + commentId + urlLikeStatus
        const likeDislikeObject = await request(app)
            .put(url)
            .auth(accessTokenUser3, {type: "bearer"})
            .send({likeStatus})
            .expect(204)
    })

    /*------------------------------like comment 5 by user 2 and dislike user 3--------------------*/

    it("like comment 5 by user 2, should return 204", async () => {
        const {comment5, accessTokenUser2} = expect.getState()
        const commentId = comment5.id
        const url = urlComments + commentId + urlLikeStatus
        const likeDislikeObject = await request(app)
            .put(url)
            .auth(accessTokenUser2, {type: "bearer"})
            .send({likeStatus})
            .expect(204)
    })
    it("dislike comment 5 by user 3, should return 204", async () => {
        const {comment5, accessTokenUser3} = expect.getState()
        const commentId = comment5.id
        const url = urlComments + commentId + urlLikeStatus
        const likeDislikeObject = await request(app)
            .put(url)
            .auth(accessTokenUser3, {type: "bearer"})
            .send({dislikeStatus})
            .expect(204)
    })
    /*------------------------------like comment 6 by user 1 and dislike user 2--------------------*/

    it("like comment 6 by user 1, should return 204", async () => {
        const {comment6, accessTokenUser1} = expect.getState()
        const commentId = comment6.id
        const url = urlComments + commentId + urlLikeStatus
        const likeDislikeObject = await request(app)
            .put(url)
            .auth(accessTokenUser1, {type: "bearer"})
            .send({likeStatus})
            .expect(204)
    })
    it("dislike comment 6 by user 2, should return 204", async () => {
        const {comment6, accessTokenUser2} = expect.getState()
        const commentId = comment6.id
        const url = urlComments + commentId + urlLikeStatus
        const likeDislikeObject = await request(app)
            .put(url)
            .auth(accessTokenUser2, {type: "bearer"})
            .send({dislikeStatus})
            .expect(204)
    })
    /*--------------------------------get comment 1 by user 1 after all likes-----------------------*/

    it("get comment 1 with likes and dislikes by user 1, should return 200", async () => {
        const {comment1, accessTokenUser1} = expect.getState()
        const commentId = comment1.id
        const url = urlComments + commentId
        const comment = await request(app)
            .get(url)
            .auth(accessTokenUser1, {type: "bearer"})
            .expect(200)
        expect(comment.body).toEqual({
            id: expect.any(String),
            content,
            commentatorInfo: {
                userId: expect.any(String),
                userLogin: expect.any(String)
            },
            createdAt: expect.any(String),
            likesInfo: {
                likesCount: 2,
                dislikesCount: expect.any(Number),
                myStatus: likeStatus
            }
        })

        })




    /*------------------------------incorrect like-status ----------------------------------------------------*/


    it("create object with like status, should return 400 if incorrect likeStatus ", async () => {
        const {comment1, accessTokenUser1} = expect.getState()
        const commentId = comment1.id
        const url = urlComments + commentId + urlLikeStatus
        const likeDislikeObject = await request(app)
            .put(url)
            .auth(tokensUser1.body.accessToken, {type: "bearer"})
            .send({incorrectLikeStatus})
            .expect(400)
    })


    it("create object with like status, should return 404 if incorrect commentId ", async () => {
        const {comment1, accessTokenUser1} = expect.getState()
        const commentId = comment1.id
        const url = urlComments + "qwert" + urlLikeStatus

        await request(app)
            .put(url)
            .auth(tokensUser1.body.accessToken, {type: "bearer"})
            .send({likeStatus})
            .expect(404)
    })


    /*-----------------------------get all comments by postId--------------------------------------*/

    it("get all comments by postId", async () => {
        const {post} = expect.getState()
        const postId = post.id
        const url = urlPosts + postId + urlComments
        const comments = await request(app)
            .get(url)
            .expect(200)
        expect([comments.body])
    })

    /*-------------------------------put comment with access token auth------------------------------*/

    it('update comment, if the inputModel has incorrect values(more content length)', async () => {
        const {comment1, accessTokenUser1} = expect.getState()
        const commentId = comment1.id
        const url = urlComments + commentId
        await request(app)
            .put(url)
            .auth(tokensUser1.body.accessToken, {type: 'bearer'})
            .send({
                content: moreContentLength
            })
            .expect(400)
    })

    it('update comment, if the inputModel has incorrect values(less content length)', async () => {
        const {comment1, accessTokenUser1} = expect.getState()
        const commentId = comment1.id
        const url = urlComments + commentId
        await request(app)
            .put(url)
            .auth(tokensUser1.body.accessToken, {type: 'bearer'})
            .send({
                content: lessContentLength
            })
            .expect(400)
    })

    it('update comment, should return 401 if unauthorized)', async () => {
        const {comment1, accessTokenUser1} = expect.getState()
        const commentId = comment1.id
        const url = urlComments + commentId
        await request(app)
            .put(url)
            .auth(incorrectBasicAuthName, {type: 'bearer'})
            .send({
                content
            })
            .expect(401)
    })




    /*-----------------------------update comment---------------------------*/

    it("Update comment, if try edit the comment that is not your own (code 403)", async () => {
        const {comment1,accessTokenUser2} = expect.getState()
        const commentId = comment1.id
        const url = urlComments + commentId

        await request(app)
            .put(url)
            .auth(tokensUser1.body.accessToken, {type: 'bearer'})
            .set({'x-access-token': accessTokenUser2})
            .send({
                content
            })
            .expect(403)
    })

    it("Update comment, should return 404 if comment not found", async () => {
        const {comment1, token} = expect.getState()
        const commentId = comment1.id
        const url = urlComments + "dfdfd"
        await request(app)
            .put(url)
            .auth(tokensUser1.body.accessToken, {type: 'bearer'})
            .send({
                content
            })
            .expect(404)
    })

    it("update comment success", async () => {
        const {comment1, token} = expect.getState()
        const commentId = comment1.id
        const url = urlComments + commentId
        await request(app)
            .put(url)
            .auth(tokensUser1.body.accessToken, {type: 'bearer'})
            .send({
                content
            })
            .expect(204)
    })

    /*---------------------------------------delete comment by id-----------------------------------*/

    it('delete comment, should return 401 if unauthorized)', async () => {
        const {comment1, token} = expect.getState()
        const commentId = comment1.id
        const url = urlComments + commentId
        await request(app)
            .delete(url)
            .auth(incorrectBasicAuthName, {type: 'bearer'})
            .expect(401)
    })

    it("Delete comment, if try edit the comment that is not your own (code 403)", async () => {
        const {comment1, accessTokenUser2} = expect.getState()
        const commentId = comment1.id
        const url = urlComments + commentId
        await request(app)
            .delete(url)
            .auth(tokensUser1.body.accessToken, {type: 'bearer'})
            .set({'x-access-token': accessTokenUser2})
            .expect(403)
    })

    it("Delete comment, should return 404 if comment not found", async () => {
        const {comment1, token} = expect.getState()
        const commentId = comment1.id
        const url = urlComments + commentId + "dfdfd"
        await request(app)
            .delete(url)
            .auth(tokensUser1.body.accessToken, {type: 'bearer'})
            .expect(404)
    })
    it("create comment by postId, should return 201 and object", async () => {
        const {post, /*token*/} = expect.getState()
        const postId = post.id
        const url = urlPosts + postId + urlComments

        const commentNew = await request(app)
            .post(url)
            .auth(tokensUser1.body.accessToken, {type: 'bearer'})
            .send({
                content
            })
            .expect(201)

        expect.setState({commentNew: commentNew.body})
    })

    it("delete comment success", async () => {
        const {commentNew, token} = expect.getState()
        const commentId = commentNew.id
        const url = urlComments + commentId

        await request(app)
            .delete(url)
            .auth(tokensUser1.body.accessToken, {type: 'bearer'})
            .expect(204)
    })
    afterAll(async () => {
        /* Closing database connection after each test. */
        await request(app)
            .del("/testing/all-data")
            .expect(204)
        await mongoose.connection.close()
    })
})