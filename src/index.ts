import express from 'express'
const app = express()
app.use(express.json())

const port = 3000
import {blog_Router} from "./blog_API-router/blog_API-router";

app.use("/blogs",blog_Router)
//app.use("/posts",post_Router)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})