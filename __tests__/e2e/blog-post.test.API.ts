import request from "supertest";
import {app} from "../../src"
import it from "node:test";

describe('delete all', function () {
    beforeAll(async () => {
        await request(app)
            .del("/testing/all-data")
            .expect(204)
    })


});




// describe("Create new blog", () => {
//     it("create blog, should return 201 and {}", async () => {
//         const createBlogSuccess = await request(app)
//             .post("/blogs")
//             .send({
//                 id,
//                 name,
//                 description,
//                 websiteUrl,
//                 createdAt,
//                 isMembership,
//             })
//             .expect(201,{})
//     })
// })
//
// describe('Check get all blogs', () => {
//     it("get blogs, should response 200", async () => {
//        const res = await request(app)
//             .get('/blogs')
//             .expect (200, {})
//
//     })
//     it("get blogs, should return 404")
// })


