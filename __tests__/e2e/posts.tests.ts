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
} from "../../test/blogs.constans";
import {urlBlogs} from "../../test/blogs.constans";
import {
    incorrectBasicAuthName,
    incorrectBasicAuthPass,
    loginAuth,
    passAuth
} from "../../test/auth.constans";

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
        const blogs = await request(app).get(urlBlogs).expect(200)
        const blogId = blogs.body.items[0].id;
        console.log(blogId)

        await request(app)
            .post(urlPosts)
            .auth(loginAuth, passAuth)
            .send({
                title: postTitle,
                shortDescription: postShortDescription,
                content: postContent,
                blogId
            })
            .expect(201)
    })
    it("create post, should return 400 if incorrect field title", async () => {
        const blogs = await request(app).get(urlBlogs).expect(200)
        const blogId = blogs.body.items[0].id;

        await request(app)
            .post(urlPosts)
            .auth(loginAuth, passAuth)
            .send({
                title: incorrectTitlePost,
                shortDescription: postShortDescription,
                content: postContent,
                blogId
            })
            .expect(400)
    });

    it("create post, should return 400 if incorrect field shortDescription", async () => {
        const blogs = await request(app).get(urlBlogs).expect(200)
        const blogId = blogs.body.items[0].id;

        await request(app)
            .post(urlPosts)
            .auth(loginAuth, passAuth)
            .send({
                title: postTitle,
                shortDescription: incorrectShortDescriptionPost,
                content: postContent,
                blogId
            })
            .expect(400)
    });

    it("create post should return 400 if incorrect field content", async () => {
        const blogs = await request(app).get(urlBlogs).expect(200)
        const blogId = blogs.body.items[0].id;

        await request(app)
            .post(urlPosts)
            .auth(loginAuth, passAuth)
            .send({
                title: postTitle,
                shortDescription: postShortDescription,
                content: incorrectContentPost,
                blogId
            })
            .expect(400)
    });
    it("create post, should return 400 if incorrect field blogId", async () => {
        const blogs = await request(app).get(urlBlogs).expect(200)
        const blogId = blogs.body.items[0].id;

        await request(app)
            .post(urlPosts)
            .auth(loginAuth, passAuth)
            .send({
                title: postTitle,
                shortDescription: postShortDescription,
                content: postContent,
                blogId: !blogId
            })
            .expect(400)
    });

    /*-------------------------------get post by Id--------------------------------------*/

    it(`get post, should return post by ID`, async () => {
        const posts = await request(app)
            .get(urlPosts).expect(200);
        const postId = posts.body.items[0].id;

        const post = await request(app)
            .get(urlPosts + postId).expect(200);
    });

    it(`get post, should return 404 if post not found`, async () => {
        await request(app)
            .get(urlPosts + 'blogId').expect(404);
    });

    /*------------------------------put post by Id---------------------------------------*/

    it("update post by Id, should return 404 if post not found", async () => {
        const posts = await request(app)
            .get(urlPosts + "string").expect(404);
    })

    it('update post by Id, should return 401 if auth failed', async () => {
        const posts = await request(app)
            .get(urlPosts).expect(200);
        const postId = posts.body.items[0].id;

        await request(app)
            .put(urlPosts + postId)
            .auth(incorrectBasicAuthName, incorrectBasicAuthPass)
            .expect(401)
    })

    it('update post by Id, should return 204 if success', async () => {
        const posts = await request(app)
            .get(urlPosts).expect(200);
        const postId = posts.body.items[0].id;
        console.log(postId)

        await request(app)
            .put(urlPosts + postId)
            .auth(loginAuth, passAuth)
            .send({
                title: postTitle,
                shortDescription: postShortDescription,
                content: postContent,
                postId
            })
            .expect(204)
    })
    it("update post, should return 400 if incorrect field title", async () => {
        const posts = await request(app).get(urlPosts).expect(200);
        const postId = posts.body.items[0].id;

        await request(app)
            .post(urlPosts)
            .auth(loginAuth, passAuth)
            .send({
                title: incorrectTitlePost,
                shortDescription: postShortDescription,
                content: postContent,
                postId
            })
            .expect(400)
    });

    it("update post, should return 400 if incorrect field shortDescription", async () => {
        const posts = await request(app).get(urlPosts).expect(200)
        const postId = posts.body.items[0].id;

        await request(app)
            .post(urlPosts)
            .auth(loginAuth, passAuth)
            .send({
                title: postTitle,
                shortDescription: incorrectShortDescriptionPost,
                content: postContent,
                postId
            })
            .expect(400)
    });

    it("update post, should return 400 if incorrect field content", async () => {
        const posts = await request(app).get(urlPosts).expect(200)
        const postId = posts.body.items[0].id;

        await request(app)
            .post(urlPosts)
            .auth(loginAuth, passAuth)
            .send({
                title: postTitle,
                shortDescription: postShortDescription,
                content: incorrectContentPost,
                postId
            })
            .expect(400)
    });
    it("update post, should return 400 if incorrect field postId", async () => {
        const posts = await request(app).get(urlPosts).expect(200)
        const postId = posts.body.items[0].id;

        await request(app)
            .post(urlPosts)
            .auth(loginAuth, passAuth)
            .send({
                title: postTitle,
                shortDescription: postShortDescription,
                content: postContent,
                postId: !postId
            })
            .expect(400)
    });

    /*-------------------------------delete post by id-----------------------------*/

    it("delete post by Id, should return 404 if post not found", async () => {
        const posts = await request(app)
            .get(urlPosts + "string").expect(404);
    })
    it("delete post by Id, should return 401 if incorrect auth", async () => {
        const posts = await request(app)
            .get(urlPosts).expect(200);
        const postId = posts.body.items[0].id;

        await request(app)
            .delete(urlPosts + postId)
            .auth(incorrectBasicAuthName, incorrectBasicAuthPass)
            .expect(401)
    });
    it("delete post by Id, should return 204 if success", async () => {
        const blogs = await request(app)
            .get(urlBlogs).expect(200);
        const blogId = blogs.body.items[0].id;

        await request(app)
            .delete(urlBlogs + blogId)
            .auth(loginAuth, passAuth)
            .expect(204)
    });
    afterAll(async () => {
        await request(app)
            .del("/testing/all-data")
            .expect(204)
    })

})