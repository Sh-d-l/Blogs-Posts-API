import request from "supertest";
import {app} from "../../src";
import {
    blogDescription,
    blogName,
    blogWebsiteUrl,
    foundBlogById, postContent, postShortDescription,
    postTitle,
    urlBlogs, urlComments,
    urlPosts
} from "../../test/blogs.constans";
import {incorrectBasicAuthName, incorrectBasicAuthPass, loginAuth, passAuth} from "../../test/authUsers.constans";
import {emailUser, loginUser, passUser, urlUser} from "../../test/user.constans";
import {urlAuth} from "../../test/auth.constans";
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

        await request(app)
            .post(url)
            .auth(token, { type: 'bearer' })
            .send({
                "content": "stringstringstringst"
            })
            .expect(201)

    })
})