import request from "supertest";
import {app} from "../../src/settings";
import {CreateUserWithMailModel, mongoURI} from "../../src/mongoDB/db";
import {
    emailUser,
    loginUser,
    passUser,
    urlConfirmationCode,
    urlCreateUserWithEmail,
} from "../../test_constanse/user.constans";
import mongoose from "mongoose";
import {TUsersWithHashEmailDb} from "../../src/types/types";
import {urlAuth} from "../../test_constanse/auth.constans";
import {urlDevices} from "../../test_constanse/securityDevices.constans";
import {jwtService} from "../../src/application/jwt-service";


describe("tests list devices ", () => {

    beforeAll(async () => {
        /* Connecting to the database. */
        await mongoose.connect(mongoURI)
        await request(app)
            .del("/testing/all-data")
            .expect(204)
    })

/*----------------------------create user & login--------------------------------*/

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

    it("confirmation code success, should return 204", async () => {
        const user: TUsersWithHashEmailDb | null = await CreateUserWithMailModel.findOne({email: emailUser})
        if (user) {
            await request(app)
                .post(urlConfirmationCode)
                .send({code: user.emailConfirmation.confirmationCode})
                .expect(204)
        }
    })

    it("auth , should return 200 with tokens", async () => {
        const tokens = await request(app)
            .post(urlAuth)
            .set('X-Forwarded-For', '::1')
            .set('user-agent', "1-1")
            .send({
                loginOrEmail: emailUser,
                password: passUser,
            })
            .expect(200)
        //console.log(tokens.headers['set-cookie'])
        expect(tokens.body).toEqual({
            accessToken: expect.any(String)
        })
        expect(tokens.headers['set-cookie'][0]).toEqual(expect.any(String))
        expect.setState({refreshToken1:tokens.headers['set-cookie'][0]})
        console.log("auth1",tokens.headers['set-cookie'][0], tokens.body.accessToken)
    })

    it("auth №2 with another user-agent, should return 200 with tokens", async () => {
        const tokens = await request(app)
            .post(urlAuth)
            .set('X-Forwarded-For', '::1')
            .set('user-agent', "1-2")
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
        expect.setState({refreshToken2:tokens.headers['set-cookie']})
    })

    it("auth №3 with another user-agent, should return 200 with tokens", async () => {
        const tokens = await request(app)
            .post(urlAuth)
            .set('X-Forwarded-For', '::1')
            .set('user-agent', "1-3")
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
        expect.setState({refreshToken3:tokens.headers['set-cookie']})
    })

    it("auth №4 with another user-agent, should return 200 with tokens", async () => {
        const tokens = await request(app)
            .post(urlAuth)
            .set('X-Forwarded-For', '::1')
            .set('user-agent', "1-4")
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
        expect.setState({refreshToken4:tokens.headers['set-cookie']})
    })
/*------------------------------------get all user-----------------------------------*/

    it("return all devices with active session for current user , should return 200", async () => {
        const{refreshToken1} = expect.getState()
        await request(app)
            .get(urlDevices)
            .set('cookie', refreshToken1)
            .expect(200)

    });
    it("refreshToken inside cookie is missing , should return 401", async () => {
        const{refreshToken} = expect.getState()
        await request(app)
            .get(urlDevices)
            .set('cookie', '')
            .expect(401)

    });

    it("refreshToken inside cookie is expired , should return 401", async () => {
        const user: TUsersWithHashEmailDb | null = await CreateUserWithMailModel.findOne({email:emailUser})
        const expiredRefreshToken = await  jwtService.createRefreshTokenForTests(user?.id)
        const{refreshToken} = expect.getState()
        await request(app)
            .get(urlDevices)
            .set('cookie', expiredRefreshToken)
            .expect(401)

    });

/*----------------------terminate all other (exclude current) devices session--------------------*/

    it("terminate all other (exclude current) devices session , should return 401 if refreshToken inside cookie is missing ", async () => {
        const{refreshToken} = expect.getState()
        await request(app)
            .delete(urlDevices)
            .set('cookie', '')
            .expect(401)
    });

    it("terminate all other (exclude current) devices session, should return 401 if refreshToken inside cookie is expired", async () => {
        const user: TUsersWithHashEmailDb | null = await CreateUserWithMailModel.findOne({email:emailUser})
        const expiredRefreshToken = await  jwtService.createRefreshTokenForTests(user?.id)
        const{refreshToken} = expect.getState()
        await request(app)
            .delete(urlDevices)
            .set('cookie', expiredRefreshToken)
            .expect(401)

    });
    it("terminate all other (exclude current) devices session , should return 204", async () => {
        const{refreshToken1} = expect.getState()
        await request(app)
            .delete(urlDevices)
            .set('cookie', refreshToken1)
            .expect(204)
    });


    /*------------------------------terminate session by deviceId----------------------------*/

    it("terminate session by deviceId , should return 401 if refreshToken inside cookie is missing", async () => {
        const{refreshToken1} = expect.getState()
        console.log(refreshToken1, "RefreshToken1")
        const payloadRefreshToken1:[string, Date, string] | null = await  jwtService.getPayloadRefreshToken(refreshToken1)
        console.log(payloadRefreshToken1, "payloadRefreshToken1")
        if(payloadRefreshToken1) {
            await request(app)
                .delete(urlDevices + payloadRefreshToken1[0])
                .query(payloadRefreshToken1[0])
                .set('cookie', '')
                .expect(204)
        }
    });

    it("terminate session by deviceId , should return 401 if refreshToken inside cookie is expired", async () => {
        const{refreshToken1} = expect.getState()
        const user: TUsersWithHashEmailDb | null = await CreateUserWithMailModel.findOne({email:emailUser})
        const expiredRefreshToken = await  jwtService.createRefreshTokenForTests(user?.id)
        const payloadRefreshToken1:[string, Date, string] | null = await  jwtService.getPayloadRefreshToken(refreshToken1)
        if(payloadRefreshToken1) {
            await request(app)
                .delete(urlDevices + payloadRefreshToken1[0])
                .query(payloadRefreshToken1[0])
                .set('cookie', expiredRefreshToken)
                .expect(204)
        }
    });
    it("terminate session by deviceId , should return 204 if success", async () => {
        const{refreshToken1} = expect.getState()
        const payloadRefreshToken1:[string, Date, string] | null = await  jwtService.getPayloadRefreshToken(refreshToken1)
        if(payloadRefreshToken1) {
            await request(app)
                .delete(urlDevices + payloadRefreshToken1[0])
                .query(payloadRefreshToken1[0])
                .set('cookie', refreshToken1)
                .expect(204)
        }
    });

    it("terminate session by deviceId , should return 404 not found", async () => {
        const{refreshToken1} = expect.getState()
        const payloadRefreshToken1:[string, Date, string] | null = await  jwtService.getPayloadRefreshToken(refreshToken1)
        if(payloadRefreshToken1) {
            await request(app)
                .delete(urlDevices + payloadRefreshToken1[0])
                .query(payloadRefreshToken1[0])
                .set('cookie', refreshToken1)
                .expect(404)
        }
    });


    afterAll(async () => {
        /* Closing database connection after each test. */
        await mongoose.connection.close()
    })

})