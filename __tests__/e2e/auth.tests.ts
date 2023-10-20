import request from "supertest";
import {app} from "../../src/settings";
import {
    loginUser,
    emailUser,
    passUser,
    incorrectEmailUser,
    incorrectLoginUser,
    incorrectPassUserString,
    urlUser,
    urlConfirmationCode,
    urlCreateUserWithEmail,
    incorrectPassUser,
    incorrectConfirmationCode,
    urlResendingEmail,
    incorrectPatternEmailUser,
    urlPasswordRecovery,
    urlNewPassword,
    urlRefreshTokens, urlLogout, newPass
} from "../../test_constanse/user.constans";
import {urlAuth} from "../../test_constanse/auth.constans";
import {CreateUserWithMailModel, CreateDocumentWithRecoveryCodeModel, mongoURI} from "../../src/mongoDB/db";
import mongoose from "mongoose";
import add from "date-fns/add";
import {CreateUsersWithConfirmationCode, TypeRecoveryCode} from "../../src/types/types";

describe('auth', () => {
    let tokens: any;
    let newUser;

    beforeAll(async () => {
        /* Connecting to the database. */
        await mongoose.connect(mongoURI)
        //console.log(app, "app")
        await request(app)
            .delete("/testing/all-data")
            .expect(204)
    })
    /*--------------------------create user---------------------------------*/

    it("create new user with incorrect login, should return 400", async () => {
        await request(app)
            .post(urlCreateUserWithEmail)
            .send({
                    login: incorrectLoginUser,
                    password: passUser,
                    email: emailUser,
                }
            )
            .expect(400)
    })
    it("create new user with incorrect password, should return 400", async () => {
        await request(app)
            .post(urlCreateUserWithEmail)
            .send({
                    login: loginUser,
                    password: incorrectPassUser,
                    email: emailUser,
                }
            )
            .expect(400)
    })
    it("create new user with incorrect email, should return 400", async () => {
        await request(app)
            .post(urlCreateUserWithEmail)
            .send({
                    login: loginUser,
                    password: passUser,
                    email: incorrectEmailUser,
                }
            )
            .expect(400)
    })
    it("new user, should return 204", async () => {
        await request(app)
            .post(urlCreateUserWithEmail)
            .send({
                    login: loginUser,
                    password: passUser,
                    email: emailUser,
                }
            )
            .expect(204)
    })

    /*-------------------------------resending email-------------------------------*/

    it("resending email with confirmation code , should return 204", async () => {
        await request(app)
            .post(urlResendingEmail)
            .send({email: emailUser})
            .expect(204)
    })

    /*----------------------------- confirmation code -----------------------------*/

    it("confirmation code success, should return 204", async () => {
        const user: CreateUsersWithConfirmationCode | null = await CreateUserWithMailModel.findOne({email: emailUser})
        if (user) {
            await request(app)
                .post(urlConfirmationCode)
                .send({code: user.emailConfirmation.confirmationCode})
                .expect(204)
        }
    })

    it("confirmation code expired, should return 400", async () => {
        await CreateUserWithMailModel.updateOne({email: emailUser}, {
            "emailConfirmation.expirationTime": add(new Date(), {
                hours: 0,
                minutes: 0,
            }),
        })
        const user: CreateUsersWithConfirmationCode | null = await CreateUserWithMailModel.findOne({email: emailUser})
        if (user) {
            await request(app)
                .post(urlConfirmationCode)
                .send(user.emailConfirmation.confirmationCode)
                .expect(400)
        }
    })
    it("incorrect confirmation code, should return 400", async () => {
        await request(app)
            .post(urlConfirmationCode)
            .send(incorrectConfirmationCode)
            .expect(400)
    })


    /*-----------------------------------login----------------------------------------*/

    it("auth , should return 200 with tokens", async () => {
        tokens = await request(app)
            .post(urlAuth)
            .set('X-Forwarded-For', '::1')
            .set('user-agent', "some spoofed agent")
            .send({
                loginOrEmail: emailUser,
                password: passUser,
            })
            .expect(200)
        //console.log(tokens.headers['set-cookie'])
        expect(tokens.body).toEqual({
            accessToken: expect.any(String)
        })
        expect(tokens.headers['set-cookie']).toEqual([expect.any(String)])
    })

    it("auth with correct login and incorrect pass, should return 401", async () => {
        await request(app)
            .post(urlAuth)
            .send({
                loginOrEmail: loginUser,
                password: incorrectPassUserString
            })
            .expect(401)
    })
    it("auth with incorrect login and correct pass, should return 401", async () => {
        await request(app)
            .post(urlAuth)
            .send({
                loginOrEmail: incorrectLoginUser,
                password: passUser
            })
            .expect(401)
    })

    /*--------------------------resending email with incorrect data-----------------------*/

    it("resending email with incorrect email, should return 400", async () => {
        await request(app)
            .post(urlResendingEmail)
            .send(incorrectPatternEmailUser)
            .expect(400)
    })
    it("resending email with expired confirmation code, should return 400", async () => {
        const user: CreateUsersWithConfirmationCode | null = await CreateUserWithMailModel.findOne({email: emailUser})
        if (user) {
            await request(app)
                .post(urlResendingEmail)
                .send(user.emailConfirmation.confirmationCode)
                .expect(400)
        }
    })
    it("resending email with isConfirmed:true, should return 400", async () => {
        await CreateUserWithMailModel.updateOne({email: emailUser}, {"emailConfirmation.isConfirmed": true})
        //const user = await CreateUserWithMailModel.findOne({email:emailUser})
        //console.log(user)
        await request(app)
            .post(urlResendingEmail)
            .send(emailUser)
            .expect(400)
    })

    /*------------------------------------password recovery---------------------------------*/

    it("Password recovery. If more than 5 requests were sent within 10 seconds, should return 429", async () => {
        await request(app)
            .post(urlPasswordRecovery)
            .send({email: emailUser})
            .expect(204)
        console.log("1")
        await request(app)
            .post(urlPasswordRecovery)
            .send({email: emailUser})
            .expect(204)
        console.log("2")
        await request(app)
            .post(urlPasswordRecovery)
            .send({email: emailUser})
            .expect(204)
        console.log("3")
        await request(app)
            .post(urlPasswordRecovery)
            .send({email: emailUser})
            .expect(204)
        console.log("4")
        await request(app)
            .post(urlPasswordRecovery)
            .send({email: emailUser})
            .expect(204)
        console.log("5")
        await request(app)
            .post(urlPasswordRecovery)
            .send({email: emailUser})
            .expect(204)
        console.log("6")
        await request(app)
            .post(urlPasswordRecovery)
            .send({email: emailUser})
            .expect(429)
        console.log("7")

    })

    it("password recovery, should return 204", async () => {
        await request(app)
            .post(urlPasswordRecovery)
            .send({email: emailUser})
            .expect(204)
    })

    it("password recovery, should return 204", async () => {
        await request(app)
            .post(urlPasswordRecovery)
            .send({email: emailUser})
            .expect(204)
    })

    it("password recovery with incorrect email, should return 400", async () => {
        await request(app)
            .post(urlPasswordRecovery)
            .send(incorrectPatternEmailUser)
            .expect(400)
    })

    /*-----------------------------new pass for existing user------------------------*/

    it("new password for an existing user, should return 204", async () => {
        const user: CreateUsersWithConfirmationCode | null = await CreateUserWithMailModel.findOne({email: emailUser})
        const documentWithRecoveryCode: TypeRecoveryCode | null = await CreateDocumentWithRecoveryCodeModel.findOne({userId: user?.id})
        await request(app)
            .post(urlNewPassword)
            .send({newPassword: newPass})
            .send({recoveryCode: documentWithRecoveryCode?.recoveryCode})
            .expect(204)
    })

    /*-------------------------------login with new pass-------------------------------------*/

    it("auth with new pass, should return 200 with tokens", async () => {
        tokens = await request(app)
            .post(urlAuth)
            .set('X-Forwarded-For', '::1')
            .set('user-agent', "some spoofed agent")
            .send({
                loginOrEmail: emailUser,
                password: newPass,
            })
            .expect(200)
        //console.log(tokens.headers['set-cookie'])
        expect(tokens.body).toEqual({
            accessToken: expect.any(String)
        })
        expect(tokens.headers['set-cookie']).toEqual([expect.any(String)])
    })

    it("auth with old pass, should return 401 with tokens", async () => {
        tokens = await request(app)
            .post(urlAuth)
            .set('X-Forwarded-For', '::1')
            .set('user-agent', "some spoofed agent")
            .send({
                loginOrEmail: emailUser,
                password: passUser,
            })
            .expect(401)
        //console.log(tokens.headers['set-cookie'])
        // expect(tokens.body).toEqual({
        //     accessToken: expect.any(String)
        // })
        // expect(tokens.headers['set-cookie']).toEqual([expect.any(String)])
    })

    /*-------------------------------------------------------------------------------*/


    it("new password for an existing user, expired recovery code, should return 400", async () => {
        const user: CreateUsersWithConfirmationCode | null = await CreateUserWithMailModel.findOne({emailUser})
        const updateExpirationTime = await CreateDocumentWithRecoveryCodeModel.updateOne({userId: user?.id}, {
            expirationTime: add(new Date(), {
                hours: 0,
                minutes: 0,
            })
        })
        const documentWithRecoveryCode: TypeRecoveryCode | null = await CreateDocumentWithRecoveryCodeModel.findOne({userId: user?.id})
        await request(app)
            .post(urlNewPassword)
            .send(documentWithRecoveryCode?.recoveryCode)
            .expect(400)
    })


    it("new access token and refresh token (/auth/refresh-token), should return 200 and new tokens (body, cookies)", async () => {
        await request(app)
            .post(urlRefreshTokens)
            .set('Cookie', tokens.headers['set-cookie'][0])
            .expect(200)
        //console.log(tokens.headers['set-cookie'][0])
        expect(tokens.body).toEqual({
            accessToken: expect.any(String)
        })
        expect(tokens.headers['set-cookie']).toEqual([expect.any(String)])
    })
    it("logout, should return 204", async () => {  /*изменить .set*/
        await request(app)
            .post(urlLogout)
            .set('Cookie', tokens.headers['set-cookie'][0])
            .expect(204)
    })
    // it("auth", async () => {
    //     tokens = await  request(app)
    //         .post(urlAuth)
    //         .send({
    //             loginOrEmail: emailUser,
    //             password: passUser
    //         })
    //         .expect(200)
    //     //console.log(tokens.headers['set-cookie'])
    // })
    // it("logout, should return 401 if refresh token expired", async () => {
    //     await jwtService.createRefreshToken(tokens.headers['set-cookie'][0])
    //     await  request(app)
    //         .post(urlLogout)
    //         .send(tokens.headers['set-cookie'][0])
    //     expect(204)
    // })
    afterAll(async () => {
        /* Closing database connection after each test. */
        await mongoose.connection.close()
    })

})