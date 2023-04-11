import express from 'express'
import {blog_Router} from "./blog_API-router/blog_API-router";
import {post_Router} from "./post_API-router/post_API-router";
import {posts_repositories} from "./post_API-repositories/post_API-repositories-db";
import {blogs_repositories} from "./blog_API-repositories/blog_API-repositories-db";
import {runDB} from "./repositories/db"
import {PostType} from "./post_API-repositories/post_API-repositories-memory";
process.on('unhandledRejection', function (reason, p) {
    console.error('ERROR')
    console.error(reason, p)
})
const port = process.env.PORT || 5000
export const app = express()
app.use(express.json())
app.use("/blogs",blog_Router)
app.use("/posts",post_Router)

app.delete("/testing/all-data"
    ,async (req,res) => {
    await posts_repositories.deleteAll()
    await blogs_repositories.deleteAll()

    res.sendStatus(204);
})
const startApp = async () => {
    await runDB();
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
};
startApp();