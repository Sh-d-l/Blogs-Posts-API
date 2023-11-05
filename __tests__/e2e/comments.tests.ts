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
    emailUser, loginUser, passUser, urlUser, urlCreateUserWithEmail, urlResendingEmail,
    urlConfirmationCode, loginAnotherUser, passAnotherUser, emailAnotherUser
} from "../../test_constanse/user.constans";
import {urlAuth} from "../../test_constanse/auth.constans";
import {content, lessContentLength, moreContentLength, urlComments} from
        "../../test_constanse/comments.constans";
import mongoose from "mongoose";
import {CreateUserWithMailModel, mongoURI} from "../../src/mongoDB/db";
import {CreateUsersWithConfirmationCode} from "../../src/types/types";



describe ("comments", () => {
    let  tokens:any;
    beforeAll(async () => {
        /* Connecting to the database. */
        await mongoose.connect(mongoURI)
        await request(app)
            .del("/testing/all-data")
            .expect(204)
    })
    /*----------------------------create new user---------------------------------*/

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

    /*--------------------------confirmation of registration--------------------*/

    it("confirmationCode success, should return 204", async () => {
        const user: CreateUsersWithConfirmationCode | null = await CreateUserWithMailModel.findOne({email: emailUser})

        if (user) {
            await request(app)
                .post(urlConfirmationCode)
                .send({code: user.emailConfirmation.confirmationCode})
                .expect(204)
        }
    })

    /*----------------------------login-------------------------------------------*/

    it("auth , should return 200 with tokens", async () => {
        tokens = await request(app)
            .post(urlAuth)
            .set('X-Forwarded-For', '::1')
            .set('user-agent', "some spoofed agent")
            .send({
                loginOrEmail: emailUser,
                password: passUser,
            })
            .expect(200)
        //console.log(tokens.headers['set-cookie'])
        expect(tokens.body).toEqual({
            accessToken: expect.any(String)
        })
        expect(tokens.headers['set-cookie']).toEqual([expect.any(String)])
    })

    /*----------------------------create blog--------------------------------------*/
    it("create blog, should return 201 and {}", async () => {
        await request(app)
            .post(urlBlogs)
            .auth(loginAuth,passAuth)
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
            .auth(incorrectBasicAuthName, {type: "bearer"})
            .expect(401)
    })
    it("create post, should return 201 if success", async () => {
        const blogId = await foundBlogById()
        const post = await request(app)
            .post(urlPosts)
            .auth(tokens.body.accessToken, {type:"bearer"})
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

    /*------------------------create comment by PostId------------------------------*/

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
    it("create comment by postId, should return 201 and object", async ()=> {
        const {post, /*token*/} = expect.getState()
        const postId = post.id
        const url = urlPosts + postId + urlComments

        const comment = await request(app)
            .post(url)
            .auth(tokens.body.accessToken, { type: 'bearer' })
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
            createdAt: expect.any(String)
        })

        expect.setState({comment: comment.body})
    })

  /*------------------------------get all comments by postId--------------------------------------*/

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

    it ('update comment, if the inputModel has incorrect values(more content length)', async () => {
        const {comment/*,token*/} = expect.getState()
        const commentId = comment.id
        const url = urlComments + commentId
        await request(app)
            .put(url)
            .auth(tokens.body.accessToken, { type: 'bearer' })
            .send({
                content: moreContentLength
            })
            .expect(400)
    })

    it ('update comment, if the inputModel has incorrect values(less content length)', async () => {
        const {comment,token} = expect.getState()
        const commentId = comment.id
        const url = urlComments + commentId
        await request(app)
            .put(url)
            .auth(tokens.body.accessToken, { type: 'bearer' })
            .send({
                content: lessContentLength
            })
            .expect(400)
    })

    it ('update comment, should return 401 if unauthorized)', async () => {
        const {comment,token} = expect.getState()
        const commentId = comment.id
        const url = urlComments + commentId
        await request(app)
            .put(url)
            .auth(incorrectBasicAuthName, { type: 'bearer' })
            .send({
                content
            })
            .expect(401)
    })

    it("create another user", async () => {
        const anotherUser = await request(app)
            .post(urlCreateUserWithEmail)
            .send({
                    login: loginAnotherUser,
                    password: passAnotherUser,
                    email: emailAnotherUser,
                }
            )
            .expect(204)
        expect.setState({accessTokenAnotherUser:{}})
    })
    /*--------------------------confirmation of registration another user--------------------*/

    it("confirmationCode another user success, should return 204", async () => {
        const user: CreateUsersWithConfirmationCode | null = await CreateUserWithMailModel.findOne({email: emailAnotherUser})

        if (user) {
            await request(app)
                .post(urlConfirmationCode)
                .send({code: user.emailConfirmation.confirmationCode})
                .expect(204)
        }
    })
    /*----------------------------login another user-------------------------------------------*/

    it("auth, should return 200 with tokens", async () => {
        const tokensAnotherUser = await request(app)
            .post(urlAuth)
            .set('X-Forwarded-For', '::1')
            .set('user-agent', "some spoofed agent2")
            .send({
                loginOrEmail: emailAnotherUser,
                password: passAnotherUser,
            })
            .expect(200)
        //console.log(tokens.headers['set-cookie'])
        expect(tokensAnotherUser.body).toEqual({
            accessToken: expect.any(String)
        })
        expect(tokensAnotherUser.headers['set-cookie']).toEqual([expect.any(String)])
        expect.setState({tokensAnotherUser:tokensAnotherUser.body.accessToken})
    })
/*-----------------------------update comment---------------------------*/

    it("Update comment, if try edit the comment that is not your own (code 403)", async () => {
        const {comment,tokensAnotherUser} = expect.getState()
        const commentId = comment.id
        const url = urlComments + commentId

        await request(app)
            .put(url)

            .auth(tokensAnotherUser.body.accessToken, { type: 'bearer' })
            .set({ 'x-access-token': tokens.body.accessToken })
            .query(commentId)
            .send({
                content
            })
            .expect(403)
    })

    it("Update comment, should return 404 if comment not found", async () => {
        const {comment,token} = expect.getState()
        const commentId = comment.id
        const url = urlComments + commentId + "dfdfd"
        await request(app)
            .put(url)
            .auth(tokens.body.accessToken, { type: 'bearer' })
            .send({
                content
            })
            .expect(404)
    })

    it("update comment success", async () => {
      const {comment,token} = expect.getState()
      const commentId = comment.id
      const url = urlComments + commentId
      await request(app)
          .put(url)
          .auth(tokens.body.accessToken, { type: 'bearer' })
          .send({
              content
          })
          .expect(204)
  })

/*---------------------------------------delete comment by id-----------------------------------*/

    it ('delete comment, should return 401 if unauthorized)', async () => {
        const {comment,token} = expect.getState()
        const commentId = comment.id
        const url = urlComments + commentId
        await request(app)
            .delete(url)
            .auth(incorrectBasicAuthName, { type: 'bearer' })
            .expect(401)
    })

    it("Delete comment, if try edit the comment that is not your own (code 403)", async () => {
        const {comment,token} = expect.getState()
        const commentId = comment.id
        const url = urlComments + commentId
        await request(app)
            .delete(url)
            .auth(tokens.body.accessToken, { type: 'bearer' })
            .expect(403)
    })

    it("Delete comment, should return 404 if comment not found", async () => {
        const {comment,token} = expect.getState()
        const commentId = comment.id
        const url = urlComments + commentId + "dfdfd"
        await request(app)
            .delete(url)
            .auth(tokens.body.accessToken, { type: 'bearer' })
            .expect(404)
    })
    it("create comment by postId, should return 201 and object", async ()=> {
        const {post, /*token*/} = expect.getState()
        const postId = post.id
        const url = urlPosts + postId + urlComments

        const commentNew = await request(app)
            .post(url)
            .auth(tokens.body.accessToken, {type: 'bearer'})
            .send({
                content
            })
            .expect(201)

        expect.setState({commentNew: commentNew.body})
    })

    it("delete comment success", async () => {
        const {commentNew,token} = expect.getState()
        const commentId = commentNew.id
        const url = urlComments + commentId
        console.log(commentNew, "commentNew")
        console.log(commentId, "commentId")
        await request(app)
            .delete(url)
            .auth(tokens.body.accessToken, { type: 'bearer' })
            .expect(204)
    })
    afterAll(async () => {
        /* Closing database connection after each test. */
        await mongoose.connection.close()
    })
})