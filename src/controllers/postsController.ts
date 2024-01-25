import {container} from "../composition-root";
import {basicAuth} from "../auth/basic_auth";
import {
    createCommentValidation,
    createPostValidation, likeStatusValidationArray,
    updatePostValidation
} from "../middlewares/validators/validations";

import {Router} from "express";
import {authMiddleware} from "../middlewares/authMiddleware";
import {PostsController} from "../routers/post_API-router";
export const postRouter = Router({});
/*------------------------------get all post (postRepoQuery) -------------*/

const postsController = container.resolve(PostsController)
postRouter.get('/', postsController.getAllPosts.bind(postsController) )

/*------------------------------like status of post-----------------------*/

postRouter.put('/:postId/like-status',
    authMiddleware,
    ...likeStatusValidationArray,
    postsController.makeLikeOfPost.bind(postsController)
    )


/*------------------------------create post------------------------------*/

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

/*------------------------get post by id-----------------------------------*/

postRouter.get('/:id', postsController.returnPostById.bind(postsController))

/*-----------------------update post---------------------------------------*/

postRouter.put('/:id',
    //authMiddleware,
    basicAuth,
    ...updatePostValidation,
    postsController.updateComment.bind(postsController) )

/*------------------------delete post---------------------------------------*/

postRouter.delete('/:id',
    //authMiddleware,
    basicAuth,
    postsController.deletePostById.bind(postsController))