import express from "express"
import { AuthDto, AuthService, UserDto, UserService } from "../internal_exports";

export default class UserController{
    protected authService: AuthService.default;
    protected userService: UserService.default;
    constructor(){
        this.authService = new AuthService.default();
        this.userService = new UserService.default();
    }
    public async updateUser(req:express.Request, res:express.Response, next:express.NextFunction){
        try{
            const params: UserDto.UpdateUserReqDto = {...req.body, ...req.params};
            // const userId = req.userId!
            await this.userService.updateUser(params,req.userId!);
            res.status(200).json({msg:'User Updated Successfully'})
        }catch(e){
            next(e);
        }
    }

   
}

