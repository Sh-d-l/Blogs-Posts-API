import request from "supertest";
import {app} from "../../src";

import {
    loginUser,
    emailUser,
    passUser,
    incorrectEmailUser,
    incorrectLoginUser,
    incorrectPassUserString, urlUser, urlConfirmationCode
} from "../../test_constanse/user.constans";
import {urlAuth} from "../../test_constanse/auth.constans";
import {usersCollection} from "../../src/mongoDB/db";
import {usersRepoDb} from "../../src/repositories/users_API-repositories-db";

describe('auth', () => {
    let tokens;
    let newUser;
    it("create new user, should return 201 and {}", async () => {
         newUser = await request(app)
            .post(urlUser)
            .send({
                    login: loginUser,
                    password: passUser,
                    email: emailUser,
                }
            )
            .expect(201)
        expect(newUser.body).toEqual({
            createdAt: expect.any(String),
            email: emailUser,
            id: expect.any(String),
            login: loginUser,
        })
    })

    it("confirmation code success, should return 204", async () => {
        const user = await usersCollection.findOne({email:emailUser})
        if(user) {
            await  request(app)
                .post(urlConfirmationCode)
                .send(user.emailConfirmation.confirmationCode)

            expect(204)
        }
    })

    it("auth with correct login and pass, should return 200 with token", async () => {
        tokens = await  request(app)
            .post(urlAuth)
            .send({
                loginOrEmail: loginUser,
                password: passUser
            })
            .expect(200)

        expect(tokens.body).toEqual({
            accessToken: expect.any(String)
        })
        expect(tokens.headers['set-cookie']).toEqual(expect.any(String))

        const refreshToken = tokens.headers['set-cookie'] //'refreshToken=djjfnogfgdfjgkdf'
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

    // it("auth with correct email and pass, should return 200 with token", async () => {
    //     await  request(app)
    //         .post(urlAuth)
    //         .send({
    //             loginOrEmail: emailUser,
    //             password: passUser
    //         })
    //         .expect(200)
    // })
    // it("auth with correct email and incorrect pass, should return 401", async () => {
    //     await  request(app)
    //         .post(urlAuth)
    //         .send({
    //             loginOrEmail: emailUser,
    //             password: incorrectPassUserString
    //         })
    //         .expect(401)
    // })
    // it("auth with incorrect email and correct pass, should return 401", async () => {
    //     await  request(app)
    //         .post(urlAuth)
    //         .send({
    //             loginOrEmail: incorrectEmailUser,
    //             password: passUser
    //         })
    //         .expect(401)
    // })

})