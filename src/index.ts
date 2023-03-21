import express from 'express'
app.use(express.json())
const app = express()
const port = 3000


import {post_Router} from "./post_API-router/post_API-router"

app.use("/blogs",blog_Router)
app.use("/posts",post_Router)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})