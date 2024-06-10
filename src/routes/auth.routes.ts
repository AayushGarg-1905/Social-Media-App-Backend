import express from "express";
import { DtoValidatorMiddleware, AuthController, AuthDto  } from '../internal_exports'

const router = express.Router();
const dtoValidatorMiddleware = new DtoValidatorMiddleware.default();

const authController = new AuthController.default();



router.post('/register', dtoValidatorMiddleware.validateRequest(AuthDto.RegisterUserReqDto), authController.registerUser.bind(authController))
router.post('/login', dtoValidatorMiddleware.validateRequest(AuthDto.LoginUserReqDto), authController.loginUser.bind(authController));
export default router;