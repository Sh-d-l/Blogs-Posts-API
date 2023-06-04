import request from "supertest";
import {app} from "../../src";

import {
    loginUser,
    emailUser,
    passUser,
    incorrectEmailUser,
    incorrectLoginUser,
    incorrectPassUserString, urlUser
} from "../../test/user.constans";
import {urlAuth} from "../../test/auth.constans";
import {loginAuth, passAuth} from "../../test/authUsers.constans";

describe('auth', () => {
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
    it("auth with correct login and pass, should return 200 with token", async () => {
        const token = await  request(app)
            .post(urlAuth)
            .send({
                loginOrEmail: loginUser,
                password: passUser
            })
            .expect(200)
    })
    it("auth with correct login and incorrect pass, should return 401", async () => {
        await  request(app)
            .post(urlAuth)
            .send({
                loginOrEmail: loginUser,
                password: incorrectPassUserString
            })
            .expect(401)
    })
    it("auth with incorrect login and correct pass, should return 401", async () => {
        await  request(app)
            .post(urlAuth)
            .send({
                loginOrEmail: incorrectLoginUser,
                password: passUser
            })
            .expect(401)
    })

    it("auth with correct email and pass, should return 204", async () => {
        await  request(app)
            .post(urlAuth)
            .send({
                loginOrEmail: emailUser,
                password: passUser
            })
            .expect(204)
    })
    it("auth with correct email and incorrect pass, should return 401", async () => {
        await  request(app)
            .post(urlAuth)
            .send({
                loginOrEmail: emailUser,
                password: incorrectPassUserString
            })
            .expect(401)
    })
    it("auth with incorrect email and correct pass, should return 401", async () => {
        await  request(app)
            .post(urlAuth)
            .send({
                loginOrEmail: incorrectEmailUser,
                password: passUser
            })
            .expect(401)
    })

})