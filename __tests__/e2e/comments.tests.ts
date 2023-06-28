import request from "supertest";
import {app} from "../../src";
import {
    blogDescription,
    blogName,
    blogWebsiteUrl,
    foundBlogById, postContent, postShortDescription,
    postTitle,
    urlBlogs,
    urlPosts
} from "../../test/blogs.constans";
import {incorrectBasicAuthName, incorrectBasicAuthPass, loginAuth, passAuth} from "../../test/authUsers.constans";
import {emailUser, loginUser, passUser, urlUser,urlCreateUserWithEmail,urlResendingEmail,urlConfirmationCode} from "../../test/user.constans";
import {urlAuth} from "../../test/auth.constans";
import {content, lessContentLength, moreContentLength, urlComments} from "../../test/comments.constans";

describe ("comments", () => {
    beforeAll(async () => {
        await request(app)
            .del("/testing/all-data")
            .expect(204)
    })
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

    /*------------------------create comment by PostId------------------------------*/

    it("create new user, should return 201 and newUser", async () => {
        const newUser = await request(app)
            .post(urlUser)
            .auth(loginAuth, passAuth)
            .send({
                    login: loginUser,
                    password: passUser,
                    email: emailUser,
                }
            )
            .expect(201)
        expect(newUser.body).toEqual({
            id: expect.any(String),
            login: loginUser,
            email: emailUser,
            createdAt: expect.any(String),
        })
        expect.setState({user: {...newUser.body, password: passUser}})
    })
    it("auth with correct login and pass, should return 200 with token", async () => {
        const {user} = expect.getState()
        const token = await  request(app)
            .post(urlAuth)
            .send({
                loginOrEmail: user.login,
                password: user.password
            })
            .expect(200)

        expect(token.body.accessToken).toBeDefined()
        expect(token.body.accessToken).toEqual(expect.any(String))
        expect.setState({token: token.body.accessToken})
    })
    it("create comment by postId, should return 201 and object", async ()=> {
        const {post, token} = expect.getState()
        const postId = post.id
        const url = urlPosts + postId + urlComments

        const comment = await request(app)
            .post(url)
            .auth(token, { type: 'bearer' })
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

  /*-------------------------------put comment with bearer tokens auth------------------------------*/

    it ('update comment, if the inputModel has incorrect values(more content length)', async () => {
        const {comment,token} = expect.getState()
        const commentId = comment.id
        const url = urlComments + commentId
        await request(app)
            .put(url)
            .auth(token, { type: 'bearer' })
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
            .auth(token, { type: 'bearer' })
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
            .auth(token + "qwww", { type: 'bearer' })
            .send({
                content
            })
            .expect(401)
    })

    it("create another user", async () => {
        const anotherUser = await request(app)
            .post(urlUser)
            .auth(loginAuth, passAuth)
            .send({
                    login: loginUser,
                    password: passUser,
                    email: emailUser,
                }
            )
            .expect(201)
    })

    it("Update comment, if try edit the comment that is not your own (code 403)", async () => {
        const {comment,token} = expect.getState()
        const commentId = comment.id
        const url = urlComments + commentId
        await request(app)
            .put(url)
            .auth(token, { type: 'bearer' })
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
            .auth(token, { type: 'bearer' })
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
          .auth(token, { type: 'bearer' })
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
            .auth(token + "qwww", { type: 'bearer' })
            .expect(401)
    })

    it("Delete comment, if try edit the comment that is not your own (code 403)", async () => {
        const {comment,token} = expect.getState()
        const commentId = comment.id
        const url = urlComments + commentId
        await request(app)
            .delete(url)
            .auth(token, { type: 'bearer' })
            .expect(403)
    })

    it("Delete comment, should return 404 if comment not found", async () => {
        const {comment,token} = expect.getState()
        const commentId = comment.id
        const url = urlComments + commentId + "dfdfd"
        await request(app)
            .delete(url)
            .auth(token, { type: 'bearer' })
            .expect(404)
    })

    it("delete comment success", async () => {
        const {comment,token} = expect.getState()
        const commentId = comment.id
        const url = urlComments + commentId
        await request(app)
            .delete(url)
            .auth(token, { type: 'bearer' })
            .expect(204)
    })
})