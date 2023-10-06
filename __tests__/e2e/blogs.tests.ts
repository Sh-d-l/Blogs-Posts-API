import request from "supertest";
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
} from "../../test_constanse/blogs.constans";
import {
    incorrectBasicAuthName,
    incorrectBasicAuthPass,
    loginAuth,
    passAuth
} from "../../test_constanse/authUsers.constans";
import {app} from "../../src/settings";
import {CreateUserWithMailModel, mongoURI} from "../../src/mongoDB/db";
import mongoose from "mongoose";
import {
    emailUser,
    loginUser,
    passUser,
    urlConfirmationCode,
    urlCreateUserWithEmail
} from "../../test_constanse/user.constans";
import {urlAuth} from "../../test_constanse/auth.constans";
import {TUsersWithHashEmailDb} from "../../src/types/types";


describe('blogs', () => {
    let tokens: any;
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
            .auth(incorrectBasicAuthName, {type: "bearer"})
            .expect(401)

    });
    it("create blog, should return 201 and {}", async () => {
        const blog = await request(app)
            .post(urlBlogs)
            .set('Authorization', `Bearer ${tokens.body.accessToken}`)
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
            .auth(tokens.body.accessToken, {type: "bearer"})
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
            .auth(tokens.body.accessToken, {type: "bearer"})
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
            .auth(tokens.body.accessToken, {type: "bearer"})
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
                .auth(tokens.body.accessToken, {type: "bearer"})
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
            .auth(tokens.body.accessToken, {type: "bearer"})
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
            .auth(tokens.body.accessToken, {type: "bearer"})
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
            id: expect.any(String),
            name: blogName,
            description: blogDescription,
            websiteUrl: blogWebsiteUrl,
            createdAt: blog.body.createdAt,
            isMembership: false,
            __v:0,
            _id:expect.any(String),
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
            .auth(tokens.body.accessToken, {type: "bearer"})
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
            .auth(tokens.body.accessToken, {type: "bearer"})
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
            .auth(tokens.body.accessToken, {type: "bearer"})
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
            .auth(tokens.body.accessToken, {type: "bearer"})
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
            .auth(tokens.body.accessToken, {type: "bearer"})
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
            .auth(tokens.body.accessToken, {type: "bearer"})
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
            .auth(tokens.body.accessToken, {type: "bearer"})
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
            .auth(tokens.body.accessToken, {type: "bearer"})
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
            .auth(tokens.body.accessToken, {type: "bearer"})
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
            .auth(tokens.body.accessToken, {type: "bearer"})
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
            .auth(tokens.body.accessToken, {type: "bearer"})
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
            .auth(tokens.body.accessToken, {type: "bearer"})
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
            .auth(tokens.body.accessToken, {type: "bearer"})
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
            .auth(tokens.body.accessToken, {type: "bearer"})
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
            .auth(tokens.body.accessToken, {type: "bearer"})
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
    afterAll(async () => {
        /* Closing database connection after each test. */
        await mongoose.connection.close()
    })

})










