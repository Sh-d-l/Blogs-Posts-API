import request from "supertest";
import {app} from "../../src";

import {
    emailUser,
    loginUser,
    passUser,
    urlUser,
    incorrectLoginUser,
    incorrectPatternLoginUser,
    incorrectEmailUser,
    incorrectPatternEmailUser,
    incorrectPassUser,
    incorrectLengthLoginUserLess,
    incorrectLengthLoginUserMore,
    incorrectLengthPassUserLess,
    incorrectLengthPassUserMore
} from "../../test/user.constans";
import {
    incorrectBasicAuthName,
    incorrectBasicAuthPass,
    loginAuth,
    passAuth,
} from "../../test/auth.constans";

describe('user', () => {
    beforeAll(async () => {
        await request(app)
            .del("/testing/all-data")
            .expect(204)
    })
    /*-----------------------create new user-------------------*/
    it("create new user, should return 401 incorrect auth", async () => {
        const newUser = await request(app)
            .post(urlUser)
            .auth(incorrectBasicAuthName, incorrectBasicAuthPass)
            .expect(401)
    })

    it("create new user, should return 201 and {}", async () => {
        const newUser = await request(app)
            .post(urlUser)
            .auth(loginAuth, passAuth)
            .send({
                    login: loginUser,
                    password: passUser,
                    email: emailUser,
                }
            )
            .expect(201)
        expect(newUser.body).toEqual({
            id: newUser.body.id,
            login: loginUser,
            email: emailUser,
            createdAt: newUser.body.createdAt,
        })
    })
    it("create new user, should return 400 if incorrect login", async () => {
        await request(app)
            .post(urlUser)
            .auth(loginAuth, passAuth)
            .send({
                    login: incorrectLoginUser,
                    password: passUser,
                    email: emailUser,
                }
            )
            .expect(400)
    })
    it("create new user, should return 400 if incorrect pass", async () => {
        await request(app)
            .post(urlUser)
            .auth(loginAuth, passAuth)
            .send({
                    login: loginUser,
                    password: incorrectPassUser,
                    email: emailUser,
                }
            )
            .expect(400)
    })
    it("create new user, should return 400 if incorrect email", async () => {
        await request(app)
            .post(urlUser)
            .auth(loginAuth, passAuth)
            .send({
                    login: loginUser,
                    password: passUser,
                    email: incorrectEmailUser,
                }
            )
            .expect(400)
    })


    /*-----------------------get all users---------------------*/
    it("get all users, should return 200", async () => {
        await request(app)
            .get(urlUser)
            .auth(loginAuth, passAuth)
            .expect(200)
    })


})