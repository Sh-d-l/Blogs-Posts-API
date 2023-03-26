import express from 'express'
const app = express()
app.use(express.json())

const port = 3000
import {blog_Router} from "./blog_API-router/blog_API-router";
import {post_Router} from "./post_API-router/post_API-router";
import {delAll_Router} from "./deleteAll/deleteAll"

app.use("/blogs",blog_Router)
app.use("/posts",post_Router)
app.use("/testing/all-data",delAll_Router)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})