import {container} from "../composition-root";
import {basicAuth} from "../auth/basic_auth";
import {
    createBlogValidation,
    createPostByBlogIDValidation,
    updateBlogValidation
} from "../middlewares/validators/validations";
import {Router} from "express";
import {BlogsController} from "../routers/blog_API-router";
export const blogRouter = Router({});

const blogsController = container.resolve(BlogsController)

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