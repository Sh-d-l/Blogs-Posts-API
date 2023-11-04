import express, {Response, Request} from 'express'
import cookieParser from "cookie-parser";
import {collections} from "./mongoDB/db";
import {authRouter} from "./controllers/authController";
import {blogRouter} from "./controllers/blogsController";
import {commentsRouter} from "./controllers/commentsController";
import {securityDevicesRouter} from "./controllers/securityDevicesController";
import {postRouter} from "./controllers/postsController";
import {usersRouter} from "./controllers/superAdminUserController";
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
app.delete("/testing/all-data", async (req: Request, res: Response) => {

    const promises = collections.map(c => c.deleteMany())

    await Promise.all(promises)

    res.sendStatus(204);
})

