import express, {Response, Request} from 'express'
import {authRouter} from "./auth_API-Router/authRouter";
import {blogRouter} from "./blog_API-router/blog_API-router";
import {postRouter} from "./post_API-router/post_API-router";
import {usersRouter} from "./users_API-router/users_API-router";
// import {collections, runDB} from "./repositories/db"
//
// process.on('unhandledRejection', function (reason, p) {
//     console.error('ERROR')
//     console.error(reason, p)
// })
//
// export const port = process.env.PORT || 5000
// export const app = express()
// app.use(express.json())
//
// app.use("/auth", authRouter)
// app.use("/blogs", blogRouter)
// app.use("/posts", postRouter)
// app.use("/users", usersRouter)
//
//
// app.delete("/testing/all-data", async (req: Request, res: Response) => {
//
//     const promises = collections.map(c => c.deleteMany())
//
//     await Promise.all(promises)
//
//     res.sendStatus(204);
// })