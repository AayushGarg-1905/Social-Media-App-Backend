import express from "express";
import { DtoValidatorMiddleware, AuthController, AuthDto, AuthMiddleWare  } from '../internal_exports'

const router = express.Router();
const dtoValidatorMiddleware = new DtoValidatorMiddleware.default();
const authMiddleware = new AuthMiddleWare.default();
const authController = new AuthController.default();



router.post('/register', dtoValidatorMiddleware.validateRequest(AuthDto.RegisterUserReqDto), authController.registerUser.bind(authController))
router.post('/login', dtoValidatorMiddleware.validateRequest(AuthDto.LoginUserReqDto), authController.loginUser.bind(authController));
router.get('/check-login', authMiddleware.authenticateUser.bind(authMiddleware), authController.checkLoginUser.bind(authController));
router.post('/logout',authMiddleware.authenticateUser.bind(authMiddleware), authController.logoutUser.bind(authController));
export default router;