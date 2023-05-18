import request from "supertest";
import {app} from "../src";
import {urlBlogs} from "./blogs.constans";

export const urlUser = "/users";
export  const loginUser = "1234";
export const emailUser = "https://www.google.com/";
export const passUser = "1234567";
export const incorrectLoginUser = 123;
export const incorrectEmailUser = 123;
export  const incorrectPassUser = 123;
export const incorrectLengthLoginUserLess = "1"
export const incorrectLengthLoginUserMore = "51444444444444444444444444444444444"
export const incorrectLengthPassUserLess = "2"
export const incorrectLengthPassUserMore = "44444444444444444444444444444444444444444444444444444444444444444444444444"
export  const incorrectPatternLoginUser = /^[acv-zA-Z0-9_-]*$/;
export const incorrectPatternEmailUser = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4245iuy}$/
export const foundUserById = async () => {
    const users = await request(app)
        .get(urlBlogs).expect(200);
    return users.body.items[0].id;
}