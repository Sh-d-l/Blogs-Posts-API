import express, {Response, Request} from 'express'
import {authRouter} from "./routers/authRouter";
import {blogRouter} from "./routers/blog_API-router";
import {postRouter} from "./routers/post_API-router";
import {usersRouter} from "./routers/users_API-router";
import {commentsRouter} from "./routers/comments_API-router";
import {securityDevicesRouter} from "./routers/securityDevicesRouter";
import {collections} from "./mongoDB/db";
import cookieParser from "cookie-parser";
export const app = express()
app.use(express.json())
app.use(cookieParser())
app.set('trust proxy', true)

app.use("/auth", authRouter)
app.use("/blogs", blogRouter)
app.use("/posts", postRouter)
app.use("/users", usersRouter)
app.use("/comments", commentsRouter)
app.use("/security", securityDevicesRouter)


