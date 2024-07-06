import express from "express"
import { AuthDto, AuthService, PostService, PostDto } from "../internal_exports";

export default class PostController{
    protected authService: AuthService.default;
    protected postService: PostService.default;
    constructor(){
        this.authService = new AuthService.default();
        this.postService = new PostService.default();
    }
    
    public async createPost(req: express.Request, res: express.Response, next: express.NextFunction){
        try{
            const params:PostDto.CreatePostReqDto = {...req.body};
            const userId = req.userId!;
            const file = req.files?.image;
            const result = await this.postService.createPost(params,userId,file);
            res.status(200).json({msg:'Post created successfully', data: result})
        } catch(e){
            next(e);
        }
    }

    public async updatePost(req: express.Request, res: express.Response, next: express.NextFunction){
        try{
            const params:PostDto.UpdatePostReqDto = {...req.body, ...req.params};
            const userId = req.userId!;
            await this.postService.updatePost(params,userId);
            res.status(200).json({msg:'Post updated successfully'})
        } catch(e){
            next(e);
        }
    }

    public async deletePost(req: express.Request, res: express.Response, next: express.NextFunction){
        try{
            const params:PostDto.DeletePostReqDto = {...req.body, ...req.params};
            const userId = req.userId!;
            await this.postService.deletePost(params,userId);
            res.status(200).json({msg:'Post deleted successfully'})
        } catch(e){
            next(e);
        }
    }

    public async getSinglePost(req: express.Request, res: express.Response, next: express.NextFunction){
        try{
            const params: PostDto.GetPostReqDto = {...req.body, ...req.params};
            const result = await this.postService.getSinglePost(params);
            res.status(200).json({msg:'Post fetched successfully',data:result})
        } catch(e){
            next(e);
        }
    }

    public async getAllPosts(req: express.Request, res: express.Response, next: express.NextFunction){
        try{
            const result = await this.postService.getAllPosts();
            res.status(200).json({msg:'Post fetched successfully',data:result})
        } catch(e){
            next(e);
        }
    }

    public async getAllUserPosts(req: express.Request, res: express.Response, next: express.NextFunction){
        try{
            const params: PostDto.GetUserPostsReqDto = {...req.body, ...req.params};
            const result = await this.postService.getAllUserPosts(params);
            res.status(200).json({msg:' User Posts fetched successfully',data:result})
        } catch(e){
            next(e);
        }
    }

    public async likePost(req: express.Request, res: express.Response, next: express.NextFunction){
        try{
            const params: PostDto.LikePostReqDto = {...req.body, ...req.params};
            const userId = req.userId!;
            await this.postService.likePost(params, userId);
            res.status(200).json({msg:' User Posts liked successfully'})
        } catch(e){
            next(e);
        }
    }

    public async unLikePost(req: express.Request, res: express.Response, next: express.NextFunction){
        try{
            const params: PostDto.UnLikePostReqDto = {...req.body, ...req.params};
            const userId = req.userId!;
            await this.postService.unLikePost(params, userId);
            res.status(200).json({msg:' User Posts unliked successfully'})
        } catch(e){
            next(e);
        }
    }
}

