import {authMiddleware} from "../middlewares/authMiddleware";
import {createCommentValidation, likeStatusValidationArray} from "../middlewares/validators/validations";
import {commentsController} from "../composition-root";
import {checkUserIdMiddleware} from "../middlewares/checkUserIdMiddleware";
import {Router} from "express";
import {commentsRouter} from "../routers/comments_API-router";



commentsRouter.put("/:commentId/like-status",
    authMiddleware,
    ...likeStatusValidationArray,
    commentsController.makeLike.bind(commentsController))

commentsRouter.get("/:id", commentsController.getCommentById.bind(commentsController)  )

commentsRouter.put("/:commentId",
    authMiddleware,
    //checkUserIdMiddleware,
    ...createCommentValidation,
    commentsController.updateComment.bind(commentsController))

commentsRouter.delete("/:commentId",
    authMiddleware,
    //checkUserIdMiddleware,
    commentsController.deleteCommentById.bind(commentsController) )