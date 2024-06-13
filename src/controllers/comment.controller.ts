import express from "express"
import { AuthService, PostService,CommentService, CommentDto } from "../internal_exports";

export default class CommentController{
    protected authService: AuthService.default;
    protected postService: PostService.default;
    protected commentService: CommentService.default;
    constructor(){
        this.authService = new AuthService.default();
        this.postService = new PostService.default();
        this.commentService = new CommentService.default();
    }
    
    public async createComment(req: express.Request, res: express.Response, next: express.NextFunction){
        try{
            const params: CommentDto.CreateCommentReqDto = {...req.body, ...req.params};
            const userId = req.userId!;
            const result = await this.commentService.createComment(params,userId);
            res.status(200).json({msg:'Comment created successfully', data: result})
        } catch(e){
            next(e);
        }
    }

    public async deleteComment(req: express.Request, res: express.Response, next: express.NextFunction){
        try{
            const params:CommentDto.DeleteCommentReqDto = {...req.body, ...req.params};
            const userId = req.userId!;
            await this.commentService.deleteComment(params,userId);
            res.status(200).json({msg:'Comment deleted successfully'})
        } catch(e){
            next(e);
        }
    }

    public async getAllPostComments(req: express.Request, res: express.Response, next: express.NextFunction){
        try{
            const params:CommentDto.GetPostCommentsReqDto = {...req.body, ...req.params};
            const result = await this.commentService.getAllPostComments(params);
            res.status(200).json({msg:'Comment fetched successfully', data:result})
        } catch(e){
            next(e);
        }
    }

    public async updateComment(req: express.Request, res: express.Response, next: express.NextFunction){
        try{
            const params:CommentDto.UpdateCommentReqDto = {...req.body, ...req.params};
            const userId = req.userId!;
            const result = await this.commentService.updateComment(params,userId);
            res.status(200).json({msg:'Comment updated successfully',data:result})
        } catch(e){
            next(e);
        }
    }
}

