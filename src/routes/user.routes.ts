import express from "express";
import { AuthMiddleWare, DtoValidatorMiddleware, UserController, UserDto } from "../internal_exports";

const router = express.Router();
const authMiddleware = new AuthMiddleWare.default();
const dtoValidatorMiddleware = new DtoValidatorMiddleware.default();

const userController = new UserController.default();
router.put('/update',authMiddleware.authenticateUser.bind(authMiddleware), dtoValidatorMiddleware.validateRequest(UserDto.UpdateUserReqDto), userController.updateUser.bind(userController));
export default router;