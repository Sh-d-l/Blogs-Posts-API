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
    postByBlogIdObject,
    incorrectTitlePost,
    incorrectContentPost,
    incorrectShortDescriptionPost,
    foundBlogById,
} from "../../test/blogs.constans";
import {
    incorrectBasicAuthName,
    incorrectBasicAuthPass,
    loginAuth,
    passAuth
} from "../../test/auth.constans";


describe('blogs', () => {
    let blogId;
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
    it("get blogs, should return 200 with array blogs", async () => {
        const blogsArr = await request(app)
            .get(urlBlogs)
            .expect(200)
        expect(blogsArr.body).toEqual({pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: [{
                id: blogsArr.body.id,
                name: blogName,
                description: blogDescription,
                websiteUrl: blogWebsiteUrl,
                createdAt: blogsArr.body.createdAt,
                isMembership: false,
            }]})
    })
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
                    name: incorrectBlogName,
                    description: blogDescription,
                    websiteUrl: blogWebsiteUrl,
                })
                .expect(400)
        });
    it("create blog, should return 400 if field description is the length more than 15 characters", async () => {
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
    it("create blog, should return 400 if field websiteUrl is the length more than 15 characters", async () => {
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
    /*--------------------------get all blogs------------------------------------------*/

    it("get blogs, should return 200 with blogs", async () => {
        const blogsArr = await request(app)
            .get(urlBlogs)
            .expect(200)
        expect(blogsArr.body).toEqual({pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: [{
                id: blogsArr.body.id,
                name: blogName,
                description: blogDescription,
                websiteUrl: blogWebsiteUrl,
                createdAt: blogsArr.body.createdAt,
                isMembership: false,
            }]})
    })

    /*--------------------------get blog by Id-----------------------------------------*/

    it(`should return blog by ID`, async () => {
        // blogId = foundBlogById()
        // //console.log(blogId)
        const blogs = await request(app)
            .get(urlBlogs).expect(200);
        const blogId = blogs.body.items[0].id;

        const blog = await request(app)
            .get(urlBlogs + blogId).expect(200);
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
        const blogs = await request(app)
            .get(urlBlogs).expect(200);
        const blogId = blogs.body.items[0].id;

        await request(app)
            .post(urlBlogs + blogId + urlPosts)
            .auth(incorrectBasicAuthName, incorrectBasicAuthPass)
            .expect(401)
    })
    it('create post by blogId, should return 201 return new post', async () => {
        const blogs = await request(app)
            .get(urlBlogs).expect(200);
        const blogId = blogs.body.items[0].id;

        const resPost = await request(app)
            .post(urlBlogs + blogId + urlPosts)
            .auth(loginAuth, passAuth)
            .send({
                title: postTitle,
                shortDescription: postShortDescription,
                content: postContent
            })
            .expect(201)
        expect(resPost.body).toEqual(postByBlogIdObject)
    })
    it('create post by blogId, should return 400 if incorrect field title', async () => {
        const blogs = await request(app)
            .get(urlBlogs).expect(200);
        const blogId = blogs.body.items[0].id;

        await request(app)
            .post(urlBlogs + blogId + urlPosts)
            .auth(loginAuth, passAuth)
            .send({
                title: incorrectTitlePost,
                shortDescription: postShortDescription,
                content: postContent
            })
            .expect(400)
    })
    it('create post by blogId, should return 400 if incorrect field shortDescription', async () => {
        const blogs = await request(app)
            .get(urlBlogs).expect(200);
        const blogId = blogs.body.items[0].id;

        await request(app)
            .post(urlBlogs + blogId + urlPosts)
            .auth(loginAuth, passAuth)
            .send({
                title: postTitle,
                shortDescription: incorrectShortDescriptionPost,
                content: postContent,
            })
            .expect(400)
    })
    it('create post by blogId, should return 400 if incorrect field content', async () => {
        const blogs = await request(app)
            .get(urlBlogs).expect(200);
        const blogId = blogs.body.items[0].id;

        await request(app)
            .post(urlBlogs + blogId + urlPosts)
            .auth(loginAuth, passAuth)
            .send({
                title: postTitle,
                shortDescription: postShortDescription,
                content: incorrectContentPost,
            })
            .expect(400)
    })
    /*------------------------get all posts by blogId------------------------------*/

    it('get all posts by blogId, should return 200 if success', async () => {
        const blogs = await request(app)
            .get(urlBlogs).expect(200);
        const blogId = blogs.body.items[0].id;

        await request(app)
            .get(urlBlogs + blogId + urlPosts)
            .expect(200)
    })
    /*-----------------------update blog by id--------------------------------------*/
    it('update blog by Id, should return 401 if auth failed', async () => {
        const blogs = await request(app)
            .get(urlBlogs).expect(200);
        const blogId = blogs.body.items[0].id;

        await request(app)
            .put(urlBlogs + blogId)
            .auth(incorrectBasicAuthName, incorrectBasicAuthPass)
            .expect(401)
    })

    it('update blog by Id, should return 204 if success', async () => {
        const blogs = await request(app)
            .get(urlBlogs).expect(200);
        const blogId = blogs.body.items[0].id;

        await request(app)
            .put(urlBlogs + blogId)
            .auth(loginAuth, passAuth)
            .send({
                name: blogName,
                description: blogDescription,
                websiteUrl: blogWebsiteUrl,
            })
            .expect(204)
    })
    it("update blog by Id, should return 400 if incorrect field name", async () => {
        const blogs = await request(app)
            .get(urlBlogs).expect(200);
        const blogId = blogs.body.items[0].id;

        await request(app)
            .put(urlBlogs + blogId)
            .auth(loginAuth, passAuth)
            .send({
                name: incorrectBlogName,
                description: blogDescription,
                websiteUrl: blogWebsiteUrl,
            })
            .expect(400)
    });
    it("update blog by Id, should return 400 if incorrect field description", async () => {
        const blogs = await request(app)
            .get(urlBlogs).expect(200);
        const blogId = blogs.body.items[0].id;

        await request(app)
            .put(urlBlogs + blogId)
            .auth(loginAuth, passAuth)
            .send({
                name: blogName,
                description: incorrectBlogDescription,
                websiteUrl: blogWebsiteUrl,
            })
            .expect(400)
    });
    it("update blog by Id, should return 400 if incorrect field websiteurl", async () => {
        const blogs = await request(app)
            .get(urlBlogs).expect(200);
        const blogId = blogs.body.items[0].id;

        await request(app)
            .put(urlBlogs + blogId)
            .auth(loginAuth, passAuth)
            .send({
                name: blogName,
                description: blogDescription,
                websiteUrl: incorrectBlogWebsiteUrl,
            })
            .expect(400)
    });

    /*-------------------------------delete blog by id-----------------------------*/

    it("delete blog by Id, should return 401 if incorrect auth", async () => {
        const blogs = await request(app)
            .get(urlBlogs).expect(200);
        const blogId = blogs.body.items[0].id;

        await request(app)
            .delete(urlBlogs + blogId)
            .auth(incorrectBasicAuthName, incorrectBasicAuthPass)
            .send({
                name: blogName,
                description: blogDescription,
                websiteUrl: blogWebsiteUrl,
            })
            .expect(401)
    });
    it("delete blog by Id, should return 204 if success", async () => {
        const blogs = await request(app)
            .get(urlBlogs).expect(200);
        const blogId = blogs.body.items[0].id;

        await request(app)
            .delete(urlBlogs + blogId)
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








