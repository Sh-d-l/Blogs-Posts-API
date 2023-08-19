import request from "supertest";
import {app} from "../../src";
import {usersCollection} from "../../src/repositories/db";

describe("tests list devices ", () => {
    beforeAll(async () => {
        await request(app)
            .del("/testing/all-data")
            .expect(204)
    })
    it("create user", async () => {
        await request(app)
        // const res = await req(app).post(/users) (login:email:password)
        const userFromDb = await usersCollection.findOne({email: email})
    })
})