import express from "express";
import { DtoValidatorMiddleware,AuthMiddleWare, CommentDto, CommentController  } from '../internal_exports'

const router = express.Router();
const dtoValidatorMiddleware = new DtoValidatorMiddleware.default();
const authMiddleware = new AuthMiddleWare.default();

const commentController = new CommentController.default();

router.post('/create/:postId',authMiddleware.authenticateUser.bind(authMiddleware),dtoValidatorMiddleware.validateRequest(CommentDto.CreateCommentReqDto), commentController.createComment.bind(commentController))
router.put('/update/:commentId', authMiddleware.authenticateUser.bind(authMiddleware), dtoValidatorMiddleware.validateRequest(CommentDto.UpdateCommentReqDto), commentController.updateComment.bind(commentController));
router.delete('/delete/:commentId', authMiddleware.authenticateUser.bind(authMiddleware), dtoValidatorMiddleware.validateRequest(CommentDto.DeleteCommentReqDto), commentController.deleteComment.bind(commentController));
router.get('/all/:postId', authMiddleware.authenticateUser.bind(authMiddleware), dtoValidatorMiddleware.validateRequest(CommentDto.GetPostCommentsReqDto), commentController.getAllPostComments.bind(commentController));

export default router;