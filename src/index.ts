import express from 'express'
import {blog_Router} from "./blog_API-router/blog_API-router";
import {post_Router} from "./post_API-router/post_API-router";
import {posts_repositories} from "./post_API-repositories/post_API-repositories-db";
import {blogs_repositories} from "./blog_API-repositories/blog_API-repositories-db";
import {runDB} from "./repositories/db"

const port = process.env.PORT || 5000
export const app = express()
app.use(express.json())
app.use("/blogs",blog_Router)
app.use("/posts",post_Router)

app.delete("/testing/all-data"
    ,async (req,res) => {
    const delPost:boolean = await posts_repositories.deleteAll()
    const delBlog:boolean = await blogs_repositories.deleteAll()
    if(delBlog && delPost) {
        res.sendStatus(204)
    }
})
const startApp = async () => {
    await runDB();
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
};

startApp();