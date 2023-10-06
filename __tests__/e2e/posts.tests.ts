import request from "supertest";
import mongoose from "mongoose";
import {
    urlPosts,
    postTitle,
    postContent,
    postShortDescription,
    incorrectTitlePost,
    incorrectShortDescriptionPost,
    incorrectContentPost,
    blogName,
    blogDescription,
    blogWebsiteUrl,
    foundBlogById,
    incorrectTitlePostLength,
    incorrectShortDescriptionPostLength,
    incorrectContentPostLength,

} from "../../test_constanse/blogs.constans";
import {urlBlogs} from "../../test_constanse/blogs.constans";
import {
    incorrectBasicAuthName,
    incorrectBasicAuthPass,
    loginAuth,
    passAuth
} from "../../test_constanse/authUsers.constans";
import {foundPostById} from "../../test_constanse/posts.constants";
import {app} from "../../src/settings";
import {CreateUserWithMailModel, mongoURI} from "../../src/mongoDB/db";
import {
    emailUser,
    loginUser,
    passUser,
    urlConfirmationCode,
    urlCreateUserWithEmail
} from "../../test_constanse/user.constans";
import {TUsersWithHashEmailDb} from "../../src/types/types";
import {urlAuth} from "../../test_constanse/auth.constans";

describe('posts', () => {
    beforeAll(async () => {
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
        const user: TUsersWithHashEmailDb | null = await CreateUserWithMailModel.findOne({email: emailUser})

        if (user) {
            await request(app)
                .post(urlConfirmationCode)
                .send({code: user.emailConfirmation.confirmationCode})
                .expect(204)
        }
    })

    /*----------------------------login-------------------------------------------*/

    it("auth , should return 200 with tokens", async () => {
        const tokens = await request(app)
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
        expect.setState({tokens:tokens.body.accessToken})
    })

    /*------------------------create blog-------------------------------*/

    it("create blog, should return 201 and {}", async () => {
        const {tokens} = expect.getState()
        await request(app)
            .post(urlBlogs)
            .auth(tokens, { type: 'bearer' })
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
            .auth(incorrectBasicAuthName, {type:"bearer"})
            .expect(401)
    })
    it("create post, should return 201 if success", async () => {
        const {tokens} = expect.getState()
        const blogId = await foundBlogById()
        const post = await request(app)
            .post(urlPosts)
            .auth(tokens, { type: 'bearer' })
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

    it("create post, should return 400 if incorrect field title", async () => {
        const {tokens} = expect.getState()
        await request(app)
            .post(urlPosts)
            .auth(tokens, { type: 'bearer' })
            .send({
                title: incorrectTitlePost,
                shortDescription: postShortDescription,
                content: postContent,
                blogId: await foundBlogById()
            })
            .expect(400)
    });
    it("create post, should return 400 if incorrect field shortDescription", async () => {
        const {tokens} = expect.getState()
        await request(app)
            .post(urlPosts)
            .auth(tokens, { type: 'bearer' })
            .send({
                title: postTitle,
                shortDescription: incorrectShortDescriptionPost,
                content: postContent,
                blogId: await foundBlogById()
            })
            .expect(400)
    });

    it("create post should return 400 if incorrect field content", async () => {
        const {tokens} = expect.getState()
        await request(app)
            .post(urlPosts)
            .auth(tokens, { type: 'bearer' })
            .send({
                title: postTitle,
                shortDescription: postShortDescription,
                content: incorrectContentPost,
                blogId: await foundBlogById()
            })
            .expect(400)
    });
    it("create post, should return 400 if incorrect field blogId", async () => {
        const {tokens} = expect.getState()
        await request(app)
            .post(urlPosts)
            .auth(tokens, { type: 'bearer' })
            .send({
                title: postTitle,
                shortDescription: postShortDescription,
                content: postContent,
                blogId: !await foundBlogById()
            })
            .expect(400)
    });

    /*-------------------------------get all posts---------------------------------------*/

    it('get all posts, should return 200', async () => {
        await request(app)
            .get(urlPosts).expect(200)
    })

    /*-------------------------------get post by Id--------------------------------------*/

    it(`get post, should return post by ID`, async () => {
        const post = await request(app)
            .get(urlPosts + await foundPostById()).expect(200);
    });

    it(`get post, should return 404 if post not found`, async () => {
        await request(app)
            .get(urlPosts + 'blogId').expect(404);
    });

    /*------------------------------put post by Id---------------------------------------*/

    it('update post by Id, should return 401 if auth failed', async () => {
         await request(app)
            .put(urlPosts + await foundPostById())
            .auth(incorrectBasicAuthName, {type:"bearer"})
            .expect(401)
    })

    it('update post by Id, should return 204 if success', async () => {
        const {tokens} = expect.getState()
        await request(app)
            .put(urlPosts + await foundPostById())
            .auth(tokens, { type: 'bearer' })
            .send({
                title: postTitle,
                shortDescription: postShortDescription,
                content: postContent,
                blogId: await foundBlogById()
            })
            .expect(204)
    })

    it("update post, should return 400 if incorrect field title", async () => {
        const {tokens} = expect.getState()
       const postUpdate =  await request(app)
            .put(urlPosts + await foundPostById())
           .auth(tokens, { type: 'bearer' })
            .send({
                title: incorrectTitlePost,
                shortDescription: postShortDescription,
                content: postContent,
                blogId: await foundBlogById(),
            })
            .expect(400)
    });

    it("update post, should return 400 if incorrect field shortDescription", async () => {
        const {tokens} = expect.getState()
        await request(app)
            .put(urlPosts + await foundPostById())
            .auth(tokens, { type: 'bearer' })
            .send({
                title: postTitle,
                shortDescription: incorrectShortDescriptionPost,
                content: postContent,
                blogId: await foundBlogById(),
            })
            .expect(400)
    });

    it("update post, should return 400 if incorrect field content", async () => {
        const {tokens} = expect.getState()
        await request(app)
            .put(urlPosts + await foundPostById())
            .auth(tokens, { type: 'bearer' })
            .send({
                title: postTitle,
                shortDescription: postShortDescription,
                content: incorrectContentPost,
                blogId: await foundBlogById(),
            })
            .expect(400)
    });
    it("update post, should return 400 if incorrect field blogId", async () => {
        const {tokens} = expect.getState()
        await request(app)
            .put(urlPosts + await foundPostById())
            .auth(tokens, { type: 'bearer' })
            .send({
                title: postTitle,
                shortDescription: postShortDescription,
                content: postContent,
                blogId: !await foundBlogById()
            })
            .expect(400)
    });

    it('update post, should return 400 if length title is more 30', async () => {
        const {tokens} = expect.getState()
        await request(app)
            .put(urlPosts + await foundPostById())
            .auth(tokens, { type: 'bearer' })
            .send({
                title: incorrectTitlePostLength,
                shortDescription: postShortDescription,
                content: postContent,
            })
            .expect(400)
    })
    it('update post, should return 400 if length shortDescription is more 100', async () => {
        const {tokens} = expect.getState()
        await request(app)
            .put(urlPosts + await foundPostById())
            .auth(tokens, { type: 'bearer' })
            .send({
                title: postTitle,
                shortDescription: incorrectShortDescriptionPostLength,
                content: postContent,
            })
            .expect(400)
    })
    it('update post, should return 400 if length content is more 1000', async () => {
        const {tokens} = expect.getState()
        await request(app)
            .put(urlPosts + await foundPostById())
            .auth(tokens, { type: 'bearer' })
            .send({
                title: postTitle,
                shortDescription: postShortDescription,
                content: incorrectContentPostLength,
            })
            .expect(400)
    })

    /*-------------------------------delete post by id-----------------------------*/


    it("delete post by Id, should return 401 if incorrect auth", async () => {
        await request(app)
            .delete(urlPosts + await foundPostById())
            .auth(incorrectBasicAuthName, {type:"bearer"})
            .expect(401)
    });
    it("delete post by Id, should return 204 if success", async () => {
        const {tokens} = expect.getState()
        await request(app)
            .delete(urlPosts + await foundPostById())
            .auth(tokens, { type: 'bearer' })
            .expect(204)
    });
    it("delete post by Id, should return 404 if post not found", async () => {
        const {tokens} = expect.getState()
        await request(app)
            .delete(urlPosts + await foundPostById())
            .auth(tokens, { type: 'bearer' })
            .expect(404);
    })
    afterAll(async () => {
        /* Closing database connection after each test. */
        await mongoose.connection.close()
    })
})