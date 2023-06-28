import express, {Response, Request} from 'express'
import {authRouter} from "./auth_API-Router/authRouter";
import {blogRouter} from "./blog_API-router/blog_API-router";
import {postRouter} from "./post_API-router/post_API-router";
import {usersRouter} from "./users_API-router/users_API-router";
import {commentsRouter} from "./comments_API-Router/comments_API-router";
import {collections, runDB} from "./repositories/db"
import cookieParser from 'cookie-parser';

process.on('unhandledRejection', function (reason, p) {
    console.error('ERROR')
    console.error(reason, p)
})

export const port = process.env.PORT || 5000
export const app = express()
app.use(express.json())
app.use(cookieParser())

app.use("/auth", authRouter)
app.use("/blogs", blogRouter)
app.use("/posts", postRouter)
app.use("/users", usersRouter)
app.use("/comments", commentsRouter)


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