import express, {Response, Request} from 'express'
import {authRouter} from "./routers/authRouter";
import {blogRouter} from "./routers/blog_API-router";
import {postRouter} from "./routers/post_API-router";
import {usersRouter} from "./routers/users_API-router";
import {commentsRouter} from "./routers/comments_API-router";
import {collections, runDB} from "./repositories/db"
import cookieParser from 'cookie-parser';
import {securityDevicesRouter} from "./routers/securityDevicesRouter";

process.on('unhandledRejection', function (reason, p) {
    console.error('ERROR')
    console.error(reason, p)
})

export const port = process.env.PORT || 5000
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

export const startApp = async () => {
    await runDB();
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
};
startApp();