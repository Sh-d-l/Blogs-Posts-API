import request from "supertest";
import {app} from "../../src"
import it from "node:test";
describe('/blogs', () => {
    it("get blogs, should response 200", async () => {
       await request(app)
            .get('/blogs')
            .expect (200)
    })
    it ("post blogs")
})

