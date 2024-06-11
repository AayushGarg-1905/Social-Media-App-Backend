import express from "express";
import { DtoValidatorMiddleware,AuthMiddleWare, PostController, PostDto  } from '../internal_exports'

const router = express.Router();
const dtoValidatorMiddleware = new DtoValidatorMiddleware.default();
const authMiddleware = new AuthMiddleWare.default();

const postController = new PostController.default();

router.post('/create',authMiddleware.authenticateUser.bind(authMiddleware),dtoValidatorMiddleware.validateRequest(PostDto.CreatePostReqDto), postController.createPost.bind(postController))
router.put('/update/:postId', authMiddleware.authenticateUser.bind(authMiddleware), dtoValidatorMiddleware.validateRequest(PostDto.UpdatePostReqDto), postController.updatePost.bind(postController));
router.delete('/delete/:postId', authMiddleware.authenticateUser.bind(authMiddleware), dtoValidatorMiddleware.validateRequest(PostDto.DeletePostReqDto), postController.deletePost.bind(postController));
router.get('/all', authMiddleware.authenticateUser.bind(authMiddleware), postController.getAllPosts.bind(postController));
router.get('/all/:userId', authMiddleware.authenticateUser.bind(authMiddleware), dtoValidatorMiddleware.validateRequest(PostDto.GetUserPostsDto), postController.getAllUserPosts.bind(postController));
router.get('/:postId', authMiddleware.authenticateUser.bind(authMiddleware), dtoValidatorMiddleware.validateRequest(PostDto.GetPostReqDto), postController.getSinglePost.bind(postController));
export default router;