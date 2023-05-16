import request from "supertest";
import {app} from "../../src"
import {
    blogName,
    blogDescription,
    blogWebsiteUrl,
    incorrectBlogName,
    incorrectBlogDescription,
    incorrectBlogWebsiteUrl,
    urlBlogs,
    urlPosts,
    postTitle,
    postShortDescription,
    postContent,
    incorrectTitlePost,
    incorrectContentPost,
    incorrectShortDescriptionPost,
    foundBlogById,
    incorrectBlogNameLength,
    incorrectBlogDescriptionLength,
    incorrectBlogWebsiteUrlLength,
    incorrectContentPostLength,
    incorrectTitlePostLength,
    incorrectShortDescriptionPostLength
} from "../../test/blogs.constans";
import {
    incorrectBasicAuthName,
    incorrectBasicAuthPass,
    loginAuth,
    passAuth
} from "../../test/auth.constans";


describe('blogs', () => {
    beforeAll(async () => {
        await request(app)
            .del("/testing/all-data")
            .expect(204)
    })

    /*----------------------------get all blogs-----------------------------------*/

    it("get blogs, should return 200 with empty array", async () => {
        await request(app)
            .get(urlBlogs)
            .expect(200, {pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: []})
    })

    /*----------------------------create blog--------------------------------------*/

    it("create blog, should return 401 if incorrect auth", async () => {
        await request(app)
            .post(urlBlogs)
            .auth(incorrectBasicAuthName, incorrectBasicAuthPass)
            .expect(401)

    });
    it("create blog, should return 201 and {}", async () => {
        const blog = await request(app)
            .post(urlBlogs)
            .auth(loginAuth, passAuth)
            .send({
                name: blogName,
                description: blogDescription,
                websiteUrl: blogWebsiteUrl,
            })
            .expect(201)
        expect(blog.body).toEqual({
            id: blog.body.id,
            name: blogName,
            description: blogDescription,
            websiteUrl: blogWebsiteUrl,
            createdAt: blog.body.createdAt,
            isMembership: false,
        })
    });
    it("create blog, should return 201 and {}, ver.2", async () => {
        const blog = await request(app)
            .post(urlBlogs)
            .auth(loginAuth, passAuth)
            .send({
                name: blogName,
                description: blogDescription,
                websiteUrl: blogWebsiteUrl,
            })
            .expect(201)
        expect(blog.body).toEqual({
            id: blog.body.id,
            name: blogName,
            description: blogDescription,
            websiteUrl: blogWebsiteUrl,
            createdAt: blog.body.createdAt,
            isMembership: false,
        })
    });

    /*--------------------------get all blogs after create---------------------------*/

    it("get blogs, should return 200 with array blogs", async () => {
        await request(app)
            .get(urlBlogs)
            .expect(200)
    })
    /*-------------------------------------------------------------------------------*/

    it("create blog, should return 400 if incorrect field name", async () => {
        await request(app)
            .post(urlBlogs)
            .auth(loginAuth, passAuth)
            .send({
                name: incorrectBlogName,
                description: blogDescription,
                websiteUrl: blogWebsiteUrl,
            })
            .expect(400)
    });
    it("create blog, should return 400 if incorrect field description", async () => {
        await request(app)
            .post(urlBlogs)
            .auth(loginAuth, passAuth)
            .send({
                name: blogName,
                description: incorrectBlogDescription,
                websiteUrl: blogWebsiteUrl,
            })
            .expect(400)
    });
    it("create blog, should return 400 if incorrect field websiteurl", async () => {
        await request(app)
            .post(urlBlogs)
            .auth(loginAuth, passAuth)
            .send({
                name: blogName,
                description: blogDescription,
                websiteUrl: incorrectBlogWebsiteUrl,
            })
            .expect(400)
    });
    it("create blog, should return 400 if field name is the length more than 15 characters",
        async () => {
            await request(app)
                .post(urlBlogs)
                .auth(loginAuth, passAuth)
                .send({
                    name: incorrectBlogNameLength,
                    description: blogDescription,
                    websiteUrl: blogWebsiteUrl,
                })
                .expect(400)
        });
    it("create blog, should return 400 if field description is the length more than 500 characters", async () => {
        await request(app)
            .post(urlBlogs)
            .auth(loginAuth, passAuth)
            .send({
                name: blogName,
                description: incorrectBlogDescriptionLength,
                websiteUrl: blogWebsiteUrl,
            })
            .expect(400)
    });
    it("create blog, should return 400 if field websiteUrl is the length more than 100 characters", async () => {
        await request(app)
            .post(urlBlogs)
            .auth(loginAuth, passAuth)
            .send({
                name: blogName,
                description: blogDescription,
                websiteUrl: incorrectBlogWebsiteUrlLength,
            })
            .expect(400)
    });

    /*--------------------------get blog by Id-----------------------------------------*/

    it(`should return blog by ID`, async () => {

        const blog = await request(app)
            .get(urlBlogs + await foundBlogById()).expect(200);
        expect(blog.body).toEqual({
            id: blog.body.id,
            name: blogName,
            description: blogDescription,
            websiteUrl: blogWebsiteUrl,
            createdAt: blog.body.createdAt,
            isMembership: false,
        });
    });

    it(`should return 404 if blog not found`, async () => {
        await request(app)
            .get(urlBlogs + 'blogId').expect(404);
    });

    /*----------------------create Post by blogId---------------------------*/

    it('create post by blogId, should return 401 if auth failed', async () => {
        await request(app)
            .post(urlBlogs + await foundBlogById() + urlPosts)
            .auth(incorrectBasicAuthName, incorrectBasicAuthPass)
            .expect(401)
    })
    it('create post by blogId, should return 201 return new post', async () => {
        const resPost = await request(app)
            .post(urlBlogs + await foundBlogById() + urlPosts)
            .auth(loginAuth, passAuth)
            .send({
                title: postTitle,
                shortDescription: postShortDescription,
                content: postContent
            })
            .expect(201)
        expect(resPost.body).toEqual({
            id: resPost.body.id,
            title: postTitle,
            shortDescription: postShortDescription,
            content: postContent,
            blogId: resPost.body.blogId,
            blogName: resPost.body.blogName,
            createdAt: resPost.body.createdAt,
        })
    })
    it('create post by blogId, should return 400 if incorrect field title', async () => {
        await request(app)
            .post(urlBlogs + await foundBlogById() + urlPosts)
            .auth(loginAuth, passAuth)
            .send({
                title: incorrectTitlePost,
                shortDescription: postShortDescription,
                content: postContent
            })
            .expect(400)
    })
    it('create post by blogId, should return 400 if incorrect field shortDescription', async () => {
        await request(app)
            .post(urlBlogs + await foundBlogById() + urlPosts)
            .auth(loginAuth, passAuth)
            .send({
                title: postTitle,
                shortDescription: incorrectShortDescriptionPost,
                content: postContent,
            })
            .expect(400)
    })
    it('create post by blogId, should return 400 if incorrect field content', async () => {
        await request(app)
            .post(urlBlogs + await foundBlogById() + urlPosts)
            .auth(loginAuth, passAuth)
            .send({
                title: postTitle,
                shortDescription: postShortDescription,
                content: incorrectContentPost,
            })
            .expect(400)
    })
    it('create post by blogId, should return 400 if length title is more 30', async () => {
        await request(app)
            .post(urlBlogs + await foundBlogById() + urlPosts)
            .auth(loginAuth, passAuth)
            .send({
                title: incorrectTitlePostLength,
                shortDescription: postShortDescription,
                content: postContent,
            })
            .expect(400)
    })
    it('create post by blogId, should return 400 if length shortDescription is more 100', async () => {
        await request(app)
            .post(urlBlogs + await foundBlogById() + urlPosts)
            .auth(loginAuth, passAuth)
            .send({
                title: postTitle,
                shortDescription: incorrectShortDescriptionPostLength,
                content: postContent,
            })
            .expect(400)
    })
    it('create post by blogId, should return 400 if length content is more 1000', async () => {
        await request(app)
            .post(urlBlogs + await foundBlogById() + urlPosts)
            .auth(loginAuth, passAuth)
            .send({
                title: postTitle,
                shortDescription: postShortDescription,
                content: incorrectContentPostLength,
            })
            .expect(400)
    })


    /*------------------------get all posts by blogId------------------------------*/

    it('get all posts by blogId, should return 200 if success', async () => {
        await request(app)
            .get(urlBlogs + await foundBlogById() + urlPosts)
            .expect(200)
    })
    /*-----------------------update blog by id--------------------------------------*/
    it('update blog by Id, should return 401 if auth failed', async () => {

        await request(app)
            .put(urlBlogs + await foundBlogById())
            .auth(incorrectBasicAuthName, incorrectBasicAuthPass)
            .expect(401)
    })

    it('update blog by Id, should return 204 if success', async () => {

        await request(app)
            .put(urlBlogs + await foundBlogById())
            .auth(loginAuth, passAuth)
            .send({
                name: blogName,
                description: blogDescription,
                websiteUrl: blogWebsiteUrl,
            })
            .expect(204)
    })
    it("update blog by Id, should return 400 if incorrect field name", async () => {

        await request(app)
            .put(urlBlogs + await foundBlogById())
            .auth(loginAuth, passAuth)
            .send({
                name: incorrectBlogName,
                description: blogDescription,
                websiteUrl: blogWebsiteUrl,
            })
            .expect(400)
    });
    it("update blog by Id, should return 400 if incorrect field description", async () => {
        await request(app)
            .put(urlBlogs + await foundBlogById())
            .auth(loginAuth, passAuth)
            .send({
                name: blogName,
                description: incorrectBlogDescription,
                websiteUrl: blogWebsiteUrl,
            })
            .expect(400)
    });
    it("update blog by Id, should return 400 if incorrect field websiteurl", async () => {
        await request(app)
            .put(urlBlogs + await foundBlogById())
            .auth(loginAuth, passAuth)
            .send({
                name: blogName,
                description: blogDescription,
                websiteUrl: incorrectBlogWebsiteUrl,
            })
            .expect(400)
    });
    it("update blog by Id, should return 400 if length name is more 15 char", async () => {
        await request(app)
            .put(urlBlogs + await foundBlogById())
            .auth(loginAuth, passAuth)
            .send({
                name: incorrectBlogNameLength,
                description: blogDescription,
                websiteUrl: blogWebsiteUrl,
            })
            .expect(400)
    });
    it("update blog by Id, should return 400 if length description is more 500 char", async () => {
        await request(app)
            .put(urlBlogs + await foundBlogById())
            .auth(loginAuth, passAuth)
            .send({
                name: blogName,
                description: incorrectBlogDescriptionLength,
                websiteUrl: blogWebsiteUrl,
            })
            .expect(400)
    });
    it("update blog by Id, should return 400 if length websiteurl is more 500 char ", async () => {
        await request(app)
            .put(urlBlogs + await foundBlogById())
            .auth(loginAuth, passAuth)
            .send({
                name: blogName,
                description: blogDescription,
                websiteUrl: incorrectBlogWebsiteUrlLength,
            })
            .expect(400)
    });

    // /*-------------------------------delete blog by id-----------------------------*/

    it("delete blog by Id, should return 401 if incorrect auth", async () => {
        await request(app)
            .delete(urlBlogs + await foundBlogById())
            .auth(incorrectBasicAuthName, incorrectBasicAuthPass)
            .send({
                name: blogName,
                description: blogDescription,
                websiteUrl: blogWebsiteUrl,
            })
            .expect(401)
    });
    it("delete blog by Id, should return 204 if success", async () => {
        await request(app)
            .delete(urlBlogs + await foundBlogById())
            .auth(loginAuth, passAuth)
            .send({
                name: blogName,
                description: blogDescription,
                websiteUrl: blogWebsiteUrl,
            })
            .expect(204)
    });
    it("delete blog by Id, should return 404 not found", async () => {
        await request(app).get(urlBlogs + "string").expect(404);
    });

})










