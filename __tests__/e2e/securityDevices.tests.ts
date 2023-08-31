import request from "supertest";
import {app} from "../../src";
import {usersCollection} from "../../src/mongoDB/db";
import {emailUser, loginUser, passUser, urlUser} from "../../test_constanse/user.constans";


describe("tests list devices ", () => {
    beforeAll(async () => {
        await request(app)
            .del("/testing/all-data")
            .expect(204)
    })
    it("create new user, should return 201 and {} ", async () => {
        const res = await request(app)
            .post(urlUser)
            .send ({
                login: loginUser,
                password: passUser,
                email: emailUser,
        })
        // const res = await req(app).post(/users) (login:email:password)
        const userFromDb = await usersCollection.findOne({email: emailUser})
        userFromDb.emailConfirmation.isConfirmed = true

    })
})