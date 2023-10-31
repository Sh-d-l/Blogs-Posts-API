import {blogsController} from "../composition-root";
import {basicAuth} from "../auth/basic_auth";
import {
    createBlogValidation,
    createPostByBlogIDValidation,
    updateBlogValidation
} from "../middlewares/validators/validations";
import {Router} from "express";
import {blogRouter} from "../routers/blog_API-router";


blogRouter.get('/', blogsController.getAllBlogs.bind(blogsController))

blogRouter.post("/",
    //authMiddleware,
    basicAuth,
    ...createBlogValidation,
    blogsController.createBlog.bind(blogsController))

blogRouter.post("/:blogId/posts",
    //authMiddleware,
    basicAuth,
    ...createPostByBlogIDValidation,
    blogsController.createPostByBlogId.bind(blogsController))

blogRouter.get('/:id', blogsController.getBlogById.bind(blogsController))

blogRouter.get('/:blogId/posts', blogsController.getPostsByBlogId.bind(blogsController))

blogRouter.put('/:id',
    //authMiddleware,
    basicAuth,
    ...updateBlogValidation,
    blogsController.updateBlog.bind(blogsController)
)