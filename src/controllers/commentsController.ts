import {authMiddleware} from "../middlewares/authMiddleware";
import {createCommentValidation, likeStatusValidationArray} from "../middlewares/validators/validations";
import {commentsController} from "../composition-root";
import {Router} from "express";
import {checkUserIdMiddleware} from "../middlewares/checkUserIdMiddleware";
export const commentsRouter = Router({})

commentsRouter.put("/:commentId/like-status",
    authMiddleware,
    ...likeStatusValidationArray,
    commentsController.makeLike.bind(commentsController))

commentsRouter.get("/:id", commentsController.getCommentById.bind(commentsController)  )

commentsRouter.put("/:commentId",
    authMiddleware,
    checkUserIdMiddleware,
    ...createCommentValidation,
    commentsController.updateComment.bind(commentsController))

commentsRouter.delete("/:commentId",
    authMiddleware,
    checkUserIdMiddleware,
    commentsController.deleteCommentById.bind(commentsController) )