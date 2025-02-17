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
            await this.userService.updateUser(params,req.userId!);
            res.status(200).json({msg:'User Updated Successfully'})
        }catch(e){
            next(e);
        }
    }

    public async deleteUser(req: express.Request, res:express.Response, next: express.NextFunction){
        try{
            const userId = req.userId!
            await this.userService.deleteUser(userId);
            res.status(200).json({msg:'User deleted Successfully'});
        }catch(e){
            next(e);
        }
    }

    public async getAllUsers(req: express.Request, res:express.Response, next: express.NextFunction){
        try{
            const result = await this.userService.getAllUsers();
            res.status(200).json({msg:'Users fetched Successfully', data:result});
        }catch(e){
            next(e);
        }
    }

    public async getSingleUser(req: express.Request, res:express.Response, next: express.NextFunction){
        try{
            const params: UserDto.GetUserReqDto = {...req.body, ...req.params}
            const result = await this.userService.getSingleUser(params);
            res.status(200).json({msg:'User fetched Successfully', data:result});
        }catch(e){
            next(e);
        }
    }

    public async followUser(req: express.Request, res:express.Response, next: express.NextFunction){
        try{
            const params: UserDto.FollowUserReqDto = {...req.body, ...req.params}
            const userId = req.userId!;
            await this.userService.followUser(params, userId);
            res.status(200).json({msg:'User followed Successfully'});
        }catch(e){
            next(e);
        }
    }

    public async unFollowUser(req: express.Request, res:express.Response, next: express.NextFunction){
        try{
            const params: UserDto.UnFollowUserReqDto = {...req.body, ...req.params}
            const userId = req.userId!;
            const result = await this.userService.unFollowUser(params, userId);
            res.status(200).json({msg:'User unFollowed Successfully', data:result});
        }catch(e){
            next(e);
        }
    }

    public async getFollowingList(req: express.Request, res:express.Response, next: express.NextFunction){
        try{
            const params: UserDto.GetFollowingListReqDto = {...req.body, ...req.params}
            // const userId = req.userId!;
            const result = await this.userService.getFollowingList(params);
            res.status(200).json({msg:'Following List fetched successfully', data:result});
        }catch(e){
            next(e);
        }
    }

    public async getFollowersList(req: express.Request, res:express.Response, next: express.NextFunction){
        try{
            const params: UserDto.GetFollowersListReqDto = {...req.body, ...req.params}
            // const userId = req.userId!;
            const result = await this.userService.getFollowersList(params);
            res.status(200).json({msg:'Followers List fetched successfully', data:result});
        }catch(e){
            next(e);
        }
    }

}

