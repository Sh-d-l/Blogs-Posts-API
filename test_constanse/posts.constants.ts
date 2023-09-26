import request from "supertest";
import {app} from "../src/settings";
import {urlPosts} from "./blogs.constans";

export const foundPostById = async () => {
    const post = await  request(app)
        .get(urlPosts)
        .expect(200)
    return post.body.items[0].id
}
