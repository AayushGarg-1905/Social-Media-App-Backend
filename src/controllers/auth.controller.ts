import express from "express"
import { AuthDto, AuthService } from "../internal_exports";

export default class AuthController{
    protected authService: AuthService.default;
    constructor(){
        this.authService = new AuthService.default()
    }
    public async registerUser(req:express.Request, res:express.Response, next:express.NextFunction){
        try{
            const params: AuthDto.RegisterUserReqDto = req.body;
            const result = await this.authService.registerUser(params)
            res.status(200).json({msg:'User Registered Successfully',data:result})
        }catch(e){
            next(e);
        }
    }

    public async loginUser(req: express.Request, res: express.Response, next: express.NextFunction){
        try{
            const params: AuthDto.LoginUserReqDto = req.body;
            const result = await this.authService.loginUser(params);
            res.status(200).json({msg:'User Logged in successfully', data:result})
        } catch(e){
            next(e);
        }
    }

    public async checkLoginUser(req: express.Request, res: express.Response, next: express.NextFunction){
        try{
            const userId = req.userId!;
            const result = await this.authService.checkLoginUser(userId);
            res.status(200).json({msg:'User Logged in successfully', data:result});
        } catch(e){
            next(e);
        }
    }
}

