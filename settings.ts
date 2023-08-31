import express, {Response, Request} from 'express'
import {authRouter} from "./src/routers/authRouter";
import {blogRouter} from "./src/routers/blog_API-router";
import {postRouter} from "./src/routers/post_API-router";
import {usersRouter} from "./src/routers/users_API-router";
import {commentsRouter} from "./src/routers/comments_API-router";
import {securityDevicesRouter} from "./src/routers/securityDevicesRouter";
import {collections} from "./src/mongoDB/db";
export const app = express()
app.use(express.json())

app.use("/auth", authRouter)
app.use("/blogs", blogRouter)
app.use("/posts", postRouter)
app.use("/users", usersRouter)
app.use("/comments", commentsRouter)
app.use("/security", securityDevicesRouter)


app.delete("/testing/all-data", async (req: Request, res: Response) => {

    const promises = collections.map(c => c.deleteMany())

    await Promise.all(promises)

    res.sendStatus(204);
})