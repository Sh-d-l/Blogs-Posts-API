import request from "supertest";
import {app} from "../../src";
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
    urlComments
} from "../../test/blogs.constans";
import {urlBlogs} from "../../test/blogs.constans";
import {
    incorrectBasicAuthName,
    incorrectBasicAuthPass,
    loginAuth,
    passAuth
} from "../../test/authUsers.constans";
import {foundPostById} from "../../test/posts.constants";
import {emailUser, loginUser, passUser, urlUser} from "../../test/user.constans";
import {urlAuth} from "../../test/auth.constans";
//import it from "node:test";

describe('posts', () => {
    beforeAll(async () => {
        await request(app)
            .del("/testing/all-data")
            .expect(204)
    })
    /*------------------------create blog-------------------------------*/

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
       // const posts = await request(app)
       //          .get(urlPosts).expect(200);
       // const postId = posts.body.items[0].id;

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
    /*-------------------------------------------------------------------------------*/

    it("create post, should return 400 if incorrect field title", async () => {
        await request(app)
            .post(urlPosts)
            .auth(loginAuth, passAuth)
            .send({
                title: incorrectTitlePost,
                shortDescription: postShortDescription,
                content: postContent,
                blogId: await foundBlogById()
            })
            .expect(400)
    });

    it("create post, should return 400 if incorrect field shortDescription", async () => {
        await request(app)
            .post(urlPosts)
            .auth(loginAuth, passAuth)
            .send({
                title: postTitle,
                shortDescription: incorrectShortDescriptionPost,
                content: postContent,
                blogId: await foundBlogById()
            })
            .expect(400)
    });

    it("create post should return 400 if incorrect field content", async () => {
        await request(app)
            .post(urlPosts)
            .auth(loginAuth, passAuth)
            .send({
                title: postTitle,
                shortDescription: postShortDescription,
                content: incorrectContentPost,
                blogId: await foundBlogById()
            })
            .expect(400)
    });
    it("create post, should return 400 if incorrect field blogId", async () => {
        await request(app)
            .post(urlPosts)
            .auth(loginAuth, passAuth)
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
            .auth(incorrectBasicAuthName, incorrectBasicAuthPass)
            .expect(401)
    })

    it('update post by Id, should return 204 if success', async () => {
        await request(app)
            .put(urlPosts + await foundPostById())
            .auth(loginAuth, passAuth)
            .send({
                title: postTitle,
                shortDescription: postShortDescription,
                content: postContent,
                blogId: await foundBlogById()
            })
            .expect(204)
    })

    it("update post, should return 400 if incorrect field title", async () => {
       const postUpdate =  await request(app)
            .put(urlPosts + await foundPostById())
            .auth(loginAuth, passAuth)
            .send({
                title: incorrectTitlePost,
                shortDescription: postShortDescription,
                content: postContent,
                blogId: await foundBlogById(),
            })
            .expect(400)
    });

    it("update post, should return 400 if incorrect field shortDescription", async () => {
        await request(app)
            .put(urlPosts + await foundPostById())
            .auth(loginAuth, passAuth)
            .send({
                title: postTitle,
                shortDescription: incorrectShortDescriptionPost,
                content: postContent,
                blogId: await foundBlogById(),
            })
            .expect(400)
    });

    it("update post, should return 400 if incorrect field content", async () => {
        await request(app)
            .put(urlPosts + await foundPostById())
            .auth(loginAuth, passAuth)
            .send({
                title: postTitle,
                shortDescription: postShortDescription,
                content: incorrectContentPost,
                blogId: await foundBlogById(),
            })
            .expect(400)
    });
    it("update post, should return 400 if incorrect field blogId", async () => {
        await request(app)
            .put(urlPosts + await foundPostById())
            .auth(loginAuth, passAuth)
            .send({
                title: postTitle,
                shortDescription: postShortDescription,
                content: postContent,
                blogId: !await foundBlogById()
            })
            .expect(400)
    });

    it('update post, should return 400 if length title is more 30', async () => {
        await request(app)
            .put(urlPosts + await foundPostById())
            .auth(loginAuth, passAuth)
            .send({
                title: incorrectTitlePostLength,
                shortDescription: postShortDescription,
                content: postContent,
            })
            .expect(400)
    })
    it('update post, should return 400 if length shortDescription is more 100', async () => {
        await request(app)
            .put(urlPosts + await foundPostById())
            .auth(loginAuth, passAuth)
            .send({
                title: postTitle,
                shortDescription: incorrectShortDescriptionPostLength,
                content: postContent,
            })
            .expect(400)
    })
    it('update post, should return 400 if length content is more 1000', async () => {
        await request(app)
            .put(urlPosts + await foundPostById())
            .auth(loginAuth, passAuth)
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
            .expect(401)
    });


    it("delete post by Id, should return 401 if incorrect auth", async () => {
        await request(app)
            .delete(urlPosts + await foundPostById())
            .auth(incorrectBasicAuthName, incorrectBasicAuthPass)
            .expect(401)
    });
    it("delete post by Id, should return 404 if post not found", async () => {
        await request(app)
            .delete(urlPosts + "string").auth(loginAuth, passAuth).expect(404);
    })

    it("delete post by Id, should return 204 if success", async () => {
        await request(app)
            .delete(urlPosts + await foundPostById())
            .auth(loginAuth, passAuth)
            .expect(204)
    });

})