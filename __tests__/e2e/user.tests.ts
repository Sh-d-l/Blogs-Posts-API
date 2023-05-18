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
    incorrectLengthPassUserMore, foundUserById
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
    it("create new user, should return 400 if the login length is less", async () => {
        await request(app)
            .post(urlUser)
            .auth(loginAuth, passAuth)
            .send({
                    login: incorrectLengthLoginUserLess,
                    password: passUser,
                    email: emailUser,
                }
            )
            .expect(400)
    })
    it("create new user, should return 400 if the login length is more", async () => {
        await request(app)
            .post(urlUser)
            .auth(loginAuth, passAuth)
            .send({
                    login: incorrectLengthLoginUserMore,
                    password: passUser,
                    email: emailUser,
                }
            )
            .expect(400)
    })
    it("create new user, should return 400 if incorrect logins pattern", async () => {
        await request(app)
            .post(urlUser)
            .auth(loginAuth, passAuth)
            .send({
                    login: incorrectPatternLoginUser,
                    password: passUser,
                    email: emailUser,
                }
            )
            .expect(400)
    })
    it("create new user, should return 400 if the pass length is less", async () => {
        await request(app)
            .post(urlUser)
            .auth(loginAuth, passAuth)
            .send({
                    login: loginUser,
                    password: incorrectLengthPassUserLess,
                    email: emailUser,
                }
            )
            .expect(400)
    })
    it("create new user, should return 400 if the login length is more", async () => {
        await request(app)
            .post(urlUser)
            .auth(loginAuth, passAuth)
            .send({
                    login: loginUser,
                    password: incorrectLengthPassUserMore,
                    email: emailUser,
                }
            )
            .expect(400)
    })
    it("create new user, should return 400 if the incorrect email's pattern", async () => {
        await request(app)
            .post(urlUser)
            .auth(loginAuth, passAuth)
            .send({
                    login: loginUser,
                    password: passUser,
                    email: incorrectPatternEmailUser,
                }
            )
            .expect(400)
    })


    /*-----------------------get all users---------------------*/
    it("get all user, should return 401 incorrect auth", async () => {
        const newUser = await request(app)
            .get(urlUser)
            .auth(incorrectBasicAuthName, incorrectBasicAuthPass)
            .expect(401)
    })
    it("get all users, should return 200", async () => {
        await request(app)
            .get(urlUser)
            .auth(loginAuth, passAuth)
            .expect(200)
    })
    /*------------------------delete by id--------------------*/
    it("delete user by id, should return 401 incorrect auth", async () => {
        const newUser = await request(app)
            .delete(urlUser)
            .auth(incorrectBasicAuthName, incorrectBasicAuthPass)
            .expect(401)
    })
    it("delete user by id, should return 404 if not found", async () => {
        await request(app)
            .delete(urlUser + "-123")
            .auth(loginAuth, passAuth)
            .expect(404)
    })
    it("delete user by id, should return 204 if success", async () => {
        await request(app)
            .delete(urlUser + await foundUserById())
            .auth(loginAuth, passAuth)
            .expect(204)
    })


})