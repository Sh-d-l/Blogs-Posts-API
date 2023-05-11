import request from "supertest";
import {app} from "../src";

export const blogName = "new name";
export const blogDescription = "new description";
export const blogWebsiteUrl = "https://google.com"

export const urlBlogs = "/blogs/"
export const urlPosts = "/posts"

export const incorrectBlogName = 123;
export const incorrectBlogDescription = null;
export const incorrectBlogWebsiteUrl = "https://gfththt"

export const incorrectTitlePost = 123;
export const incorrectShortDescriptionPost = 123;
export const incorrectContentPost = 123;


export const postTitle = "string";
export  const postShortDescription = "string";
export const postContent = "string"


export const blogObject = {
    id: expect.any(String),
    name: blogName,
    description: blogDescription,
    websiteUrl: blogWebsiteUrl,
    createdAt: expect.any(String),
    isMembership: false,
};

export const postByBlogIdObject ={
    id: expect.any(String),
    title: postTitle,
    shortDescription: postShortDescription,
    content: postContent,
    blogId: expect.any(String),
    blogName: expect.any(String),
    createdAt: expect.any(String),
}


