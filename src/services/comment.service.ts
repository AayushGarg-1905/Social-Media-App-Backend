import { Types } from "mongoose";
import { BadRequestError } from "../config/error";
import { AuthDto, UserModel, EncryptionService, DatabaseService, CommonUtils, PassportModel, PostModel, PostDto, UserService, CommentDto, CommentModel } from "../internal_exports";

export default class CommentService {
    protected encryptionService: EncryptionService.default
    protected databaseService: DatabaseService.default
    constructor() {
        this.encryptionService = new EncryptionService.default();
        this.databaseService = new DatabaseService.default();
    }

    public async createComment(params: CommentDto.CreateCommentReqDto, userId:Types.ObjectId){
        await this.validateCreateComment(params);

        const createCommentDoc = {
            text: params.text,
            postId: params.postId,
            userId: userId
        }
        const comment = await CommentModel.default.create(createCommentDoc);
        return comment;
    }

    public async deleteComment(params: CommentDto.DeleteCommentReqDto, userId: Types.ObjectId){
        const comment = await CommentModel.default.findOneAndDelete({_id:params.commentId, userId});
        if(!comment){
            throw new BadRequestError("Comment does not exist");
        }
    }

    public async getAllPostComments(params: CommentDto.GetPostCommentsReqDto){
        await this.validateGetAllPostComments(params);

        const comments = await CommentModel.default.find({postId: params.postId});

        const commentData = comments.map((comment)=>{
            return ({
                commentId: comment._id,
                text: comment.text,
                userId: comment.userId,
            })
        })

        return commentData
    }

    public async updateComment(params: CommentDto.UpdateCommentReqDto, userId: Types.ObjectId){
        const {comment} = await this.validateUpdateComment(params,userId);

        comment.text = params.text,
        await comment.save();
        return comment;
    }

    private async validateCreateComment(params: CommentDto.CreateCommentReqDto){
        const comment = await CommentModel.default.findOne({_id:params.postId});
        if(!comment){
            throw new BadRequestError("Comment does not exist");
        }
    }

    private async validateGetAllPostComments(params: CommentDto.GetPostCommentsReqDto){
        const comment = await CommentModel.default.findOne({_id:params.postId});
        if(!comment){
            throw new BadRequestError("Comment does not exist");
        }
    }

    private async validateUpdateComment(params: CommentDto.UpdateCommentReqDto, userId:Types.ObjectId){
        const comment = await CommentModel.default.findOne({_id:params.commentId, userId});
        if(!comment){
            throw new BadRequestError("Comment does not exist");
        }
        return {comment}
    }


}