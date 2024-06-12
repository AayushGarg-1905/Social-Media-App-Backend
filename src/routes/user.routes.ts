import express from "express";
import { AuthMiddleWare, DtoValidatorMiddleware, UserController, UserDto } from "../internal_exports";

const router = express.Router();
const authMiddleware = new AuthMiddleWare.default();
const dtoValidatorMiddleware = new DtoValidatorMiddleware.default();

const userController = new UserController.default();
router.put('/update',authMiddleware.authenticateUser.bind(authMiddleware), dtoValidatorMiddleware.validateRequest(UserDto.UpdateUserReqDto), userController.updateUser.bind(userController));
router.delete('/delete', authMiddleware.authenticateUser.bind(authMiddleware), userController.deleteUser.bind(userController));
router.get('/all', authMiddleware.authenticateUser.bind(authMiddleware), userController.getAllUsers.bind(userController));
router.get('/:id', authMiddleware.authenticateUser.bind(authMiddleware), dtoValidatorMiddleware.validateRequest(UserDto.GetUserReqDto), userController.getSingleUser.bind(userController));
router.post('/follow/:followerId', authMiddleware.authenticateUser.bind(authMiddleware), dtoValidatorMiddleware.validateRequest(UserDto.FollowUserReqDto), userController.followUser.bind(userController))
router.post('/unfollow/:followerId', authMiddleware.authenticateUser.bind(authMiddleware), dtoValidatorMiddleware.validateRequest(UserDto.UnFollowUserReqDto), userController.unFollowUser.bind(userController))
export default router;