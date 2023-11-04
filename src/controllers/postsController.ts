import {postsController} from "../composition-root";
import {basicAuth} from "../auth/basic_auth";
import {
    createCommentValidation,
    createPostValidation,
    updatePostValidation
} from "../middlewares/validators/validations";

import {Router} from "express";
import {authMiddleware} from "../middlewares/authMiddleware";
export const postRouter = Router({});

postRouter.get('/', postsController.getAllPosts.bind(postsController) )

postRouter.post('/',
    //authMiddleware,
    basicAuth,
    ...createPostValidation,
    postsController.createPost.bind(postsController) )

/*-------------------------create comment by postId------------------------*/

postRouter.post('/:postId/comments',
    //basicAuth,
    authMiddleware,
    ...createCommentValidation,
    postsController.createCommentByPostId.bind(postsController)
)

/*------------------------get comments by PostID---------------------------*/

postRouter.get('/:postId/comments', postsController.getCommentsByPostId.bind(postsController) )

/*-------------------------------------------------------------------------*/

postRouter.get('/:id', postsController.getCommentsByPostId.bind(postsController))

postRouter.put('/:id',
    //authMiddleware,
    basicAuth,
    ...updatePostValidation,
    postsController.updateComment.bind(postsController) )

postRouter.delete('/:id',
    //authMiddleware,
    basicAuth,
    postsController.deletePostById.bind(postsController))