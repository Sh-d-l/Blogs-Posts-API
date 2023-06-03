import request from "supertest";
import {app} from "../../src";

import {
    loginUser,
    emailUser,
    passUser,
    incorrectEmailUser,
    incorrectLoginUser,
    incorrectPassUserString
} from "../../test/user.constans";
import {urlAuth} from "../../test/auth.constans";

describe('auth', () => {
    it("auth with correct login and pass, should return 200 with token", async () => {
        const token = await  request(app)
            .post(urlAuth)
            .send({
                loginOrEmail: loginUser,
                password: passUser
            })
            .expect(200)
        expect(token).toEqual(token)
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