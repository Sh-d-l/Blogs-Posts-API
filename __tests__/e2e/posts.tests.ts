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
    foundBlogById, incorrectTitlePostLength, incorrectShortDescriptionPostLength, incorrectContentPostLength
} from "../../test/blogs.constans";
import {urlBlogs} from "../../test/blogs.constans";
import {
    incorrectBasicAuthName,
    incorrectBasicAuthPass,
    loginAuth,
    passAuth
} from "../../test/authUsers.constans";
import {foundPostById} from "../../test/posts.constants";

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
        const post = await request(app)
            .post(urlPosts)
            .auth(loginAuth, passAuth)
            .send({
                title: postTitle,
                shortDescription: postShortDescription,
                content: postContent,
                blogId: await foundBlogById()
            })
            .expect(201)
        expect(post.body).toEqual({
            id: post.body.id,
            title: postTitle,
            shortDescription: postShortDescription,
            content: postContent,
            blogId: await foundBlogById(),
            blogName: post.body.blogName,
            createdAt: post.body.createdAt,
        })
    })
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

    it("delete post by Id, should return 404 if post not found", async () => {
        await request(app)
            .get(urlPosts + "string").expect(404);
    })
    it("delete post by Id, should return 401 if incorrect auth", async () => {
        await request(app)
            .delete(urlPosts + await foundPostById())
            .auth(incorrectBasicAuthName, incorrectBasicAuthPass)
            .expect(401)
    });
    it("delete post by Id, should return 204 if success", async () => {
        await request(app)
            .delete(urlPosts + await foundPostById())
            .auth(loginAuth, passAuth)
            .expect(204)
    });

})