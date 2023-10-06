import request from "supertest";
import {app} from "../src/settings";
import {loginAuth, passAuth} from "./authUsers.constans";

export const urlUser = "/users/";
export const urlCreateUserWithEmail = "/auth/registration/"
export const urlConfirmationCode = "/auth/registration-confirmation/"
export  const urlResendingEmail = "/auth/registration-email-resending/"
export const urlPasswordRecovery = "/auth/password-recovery/"
export const urlNewPassword = "/auth/new-password/"
export const urlRefreshTokens = "/auth/refresh-token"
export const urlLogout = "/auth/logout"
export const loginUser = "1111111";
export const emailUser = "sh_d_l@mail.ru";
export const passUser = "string12";
export const newPass = "12345678"
export const loginAnotherUser = "222222"
export const passAnotherUser = "number"
export const emailAnotherUser = "sh.dmitry.2017@gmail.com"
export const incorrectLoginUser = 123;
export const incorrectEmailUser = 123;
export const incorrectPassUser = 123;
export const incorrectPassUserString = "qweqeeq"
export const incorrectLengthLoginUserLess = "1"
export const incorrectLengthLoginUserMore = "51444444444444444444444444444444444"
export const incorrectLengthPassUserLess = "2"
export const incorrectLengthPassUserMore = "44444444444444444444444444444444444444444444444444444444444444444444444444"
export const incorrectPatternLoginUser = /^[acv-zA-Z0-9_-]*$/;
export const incorrectPatternEmailUser = /^[\w-\.]+([\w-]+\.)+[\w-]{2,4245iuy}$/
export const incorrectConfirmationCode = undefined;
export const foundUserById = async () => {
    const users = await request(app)
        .get(urlUser)
        .auth(loginAuth, passAuth)
        .expect(200);
    return users.body.items[0].id;
}
