import request from "supertest";
import {app} from "../../src";
import {urlPosts} from "../../test/blogs.constans";
import {loginAuth, passAuth} from "../../test/auth.constans";


describe('posts', () => {
    beforeAll(async () => {
        await request(app)
            .del("/testing/all-data")
            .expect(204)
    })
    it("create post, should return 201 if success",async () => {
        await request(app)
            .post(urlPosts)
            .auth(loginAuth,passAuth)
            .send(        {
            title: "string",
            shortDescription: "string",
            content: "string",
            blogId: "string"

                })

    })



})