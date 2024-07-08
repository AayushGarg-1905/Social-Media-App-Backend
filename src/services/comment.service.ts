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
        const session = await this.databaseService.addDbTransaction();
        
        await this.databaseService.handleTransaction(session, async () => {
            const comment = await CommentModel.default.create([createCommentDoc],{session});
            await PostModel.default.updateOne({_id:params.postId},{$push:{comments:{commentId:comment[0]._id, userId:comment[0].userId}}},{ session });
        });
    }

    public async deleteComment(params: CommentDto.DeleteCommentReqDto, userId: Types.ObjectId){
        const {comment} = await this.validateDeleteComment(params,userId);

        const session = await this.databaseService.addDbTransaction();
        
        await this.databaseService.handleTransaction(session, async () => {
            await PostModel.default.updateOne({_id:comment.postId},{$pull:{comments:{commentId:params.commentId, userId:userId}}},{session})
            await CommentModel.default.deleteOne({_id:params.commentId,userId:userId},{session})
        });
    }

    public async getAllPostComments(params: CommentDto.GetPostCommentsReqDto){
        const {post} = await this.validateGetAllPostComments(params);

        const comments = await CommentModel.default.find({postId: params.postId}).sort({createdAt:-1});



        const commentData = comments.map((comment)=>{
            return ({
                commentId: comment._id,
                text: comment.text,
                userId: comment.userId,
                userName: post.userName,
                createdAt: comment.createdAt
            })
        })

        return commentData
    }

    public async updateComment(params: CommentDto.UpdateCommentReqDto, userId: Types.ObjectId){
        const {comment} = await this.validateUpdateComment(params,userId);

        comment.text = params.text,
        await comment.save();
    }

    private async validateCreateComment(params: CommentDto.CreateCommentReqDto){
        const post = await PostModel.default.findOne({_id:params.postId});
        if(!post){
            throw new BadRequestError("Post does not exist");
        }
    }

    private async validateGetAllPostComments(params: CommentDto.GetPostCommentsReqDto){
        const post = await PostModel.default.findOne({_id:params.postId});
        if(!post){
            throw new BadRequestError("Post does not exist");
        }
        return {post};
    }


    private async validateUpdateComment(params: CommentDto.UpdateCommentReqDto, userId:Types.ObjectId){
        const comment = await CommentModel.default.findOne({_id:params.commentId, userId});
        if(!comment){
            throw new BadRequestError("Comment does not exist");
        }
        return {comment}
    }

    private async validateDeleteComment(params: CommentDto.DeleteCommentReqDto,userId:Types.ObjectId){

        const comment = await CommentModel.default.findOne({_id:params.commentId,userId});
        if(!comment){
            throw new BadRequestError('Comment does not exist')
        }

        return {comment};
    
    }

}