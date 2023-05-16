import request from "supertest";
import {app} from "../../src";

import {urlUser} from "../../test/user.constans";
import {
    incorrectBasicAuthName,
    incorrectBasicAuthPass,
    loginAuth,
    passAuth
} from "../../test/auth.constans";
import exp = require("constants");

describe('user', () => {
    beforeAll(async () => {
        await request(app)
            .del("/testing/all-data")
            .expect(204)
    })
    /*-----------------------create new user-------------------*/

    it("create new user, should return 201 and {}", async () => {
        const newUser = await request(app)
            .post(urlUser)
            .auth(loginAuth, passAuth)
            .expect(201)
        expect(newUser.body).toEqual({
            id: newUser.body.id,
            login: "string",
            "email": "string",
            "createdAt": "2023-05-16T18:25:52.973Z"
        })
    })
})

/*-----------------------get all users---------------------*/
it("get all users, should return 200", async () => {
    await request(app)
        .get(urlUser)
        .auth(loginAuth, passAuth)
        .expect(200)
})
/*----------------------


})