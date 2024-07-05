import { Types } from "mongoose";
import { BadRequestError } from "../config/error";
import { AuthDto, UserModel, EncryptionService, DatabaseService, CommonUtils, PassportModel, PostModel, PostDto, UserService } from "../internal_exports";
import fileUpload from "express-fileupload";
import path from "path";

export default class PostService {
    protected encryptionService: EncryptionService.default
    protected databaseService: DatabaseService.default
    // protected userService: UserService.default;
    constructor() {
        this.encryptionService = new EncryptionService.default();
        this.databaseService = new DatabaseService.default();
        // this.userService = new UserService.default();
    }

    public async createPost(params: PostDto.CreatePostReqDto, userId:Types.ObjectId, file?:fileUpload.UploadedFile | fileUpload.UploadedFile[]){
        const { user, file: userFile } = await this.validateCreatePost(userId, file);

        let createPostDoc:any = {
            caption: params.caption,
            userName: user.userName,
            imageUrl: params.imageUrl,
            userId: userId
        }
        
        const post = await PostModel.default.create(createPostDoc);
        
        const postData = {
            caption: post.caption,
            userName: post.userName,
            userId: post.userId,
            likes: post.likes,
            comments: post.comments,
            imageUrl: post.imageUrl,
            createdAt: post.createdAt
        }
        return postData;
    }

    public async updatePost(params: PostDto.UpdatePostReqDto, userId:Types.ObjectId){
        const { post } = await this.validateUpdatePost(params, userId);
        const {caption} = params;

        if(caption){
            post.caption = caption
        }
        await post.save();
        return post
    }

    public async deletePost(params: PostDto.DeletePostReqDto, userId:Types.ObjectId){
        
        const post = await PostModel.default.findOneAndDelete({_id:params.postId, userId});
        if(!post){
            throw new BadRequestError("Post does not exist");
        }
    }

    public async getSinglePost(params: PostDto.GetPostReqDto){
        const { post } = await this.validateGetSinglePost(params);
        return post;
    }

    public async getAllPosts(){
        const posts = await PostModel.default.find({}).sort({createdAt:-1});
        const postsData = posts.map((post)=>{
            return {
                caption: post.caption,
                userName: post.userName,
                userId: post.userId,
                likes: post.likes,
                comments: post.comments,
                imageUrl: post.imageUrl,
                createdAt: post.createdAt
            }
        })
        return {postsData};
    }

    public async getAllUserPosts(params: PostDto.GetUserPostsReqDto){
        const posts = await PostModel.default.find({userId: params.userId});
        const postsData = posts.map((post)=>{
            return {
                caption: post.caption,
                userName: post.userName,
                userId: post.userId,
                likes: post.likes,
                comments: post.comments,
                imageUrl: post.imageUrl
            }
        })
        return {postsData};
    }

    public async likePost(params: PostDto.LikePostReqDto, userId: Types.ObjectId){
        await this.validateLikePost(params, userId);
        await PostModel.default.updateOne({_id: params.postId},{$push:{likes:userId}});
    }

    public async unLikePost(params: PostDto.LikePostReqDto, userId: Types.ObjectId){
        await this.validateUnLikePost(params, userId);
        await PostModel.default.updateOne({_id: params.postId},{$pull:{likes:userId}});
    }

    private async validateCreatePost(userId: Types.ObjectId, file?:fileUpload.UploadedFile | fileUpload.UploadedFile[]){
        const user = await UserModel.default.findOne({_id:userId});
        if(!user){
            throw new BadRequestError('User does not exist');
        }
        const MAX_SIZE = 1024*1024;
        if (file) {
            if (Array.isArray(file)) {
                throw new BadRequestError('Please upload a single file')
            } else {
                if (!file.mimetype.startsWith('image/')) {
                    throw new BadRequestError('Invalid file type. Only images are allowed.');
                }
                if(file.size > MAX_SIZE){
                    throw new BadRequestError('Please upload image upto 1KB');
                }
            }
        }

        return {user, file};
    }

    private async validateUpdatePost(params: PostDto.UpdatePostReqDto, userId:Types.ObjectId){
        const post = await PostModel.default.findOne({_id: params.postId, userId});
        if(!post){
            throw new BadRequestError('Post does not exsist');
        }
        return {post};
    }
    
    private async validateGetSinglePost(params: PostDto.GetPostReqDto){
        const post = await PostModel.default.findOne({_id: params.postId});
        if(!post){
            throw new BadRequestError("Post does not exist");
        }
        return {post};
    }

    private async validateLikePost(params: PostDto.LikePostReqDto, userId:Types.ObjectId){
        const post = await PostModel.default.findOne({_id: params.postId});
        if(!post){
            throw new BadRequestError("Post does not exist");
        }
        const isAlreadyLiked = post.likes.find((id)=>id.equals(userId));
        if(isAlreadyLiked){
            throw new BadRequestError('You have already liked this post');
        }
    }

    private async validateUnLikePost(params: PostDto.UnLikePostReqDto, userId:Types.ObjectId){
        const post = await PostModel.default.findOne({_id: params.postId});
        if(!post){
            throw new BadRequestError("Post does not exist");
        }
        const isAlreadyLiked = post.likes.find((id)=>id.equals(userId));
        if(!isAlreadyLiked){
            throw new BadRequestError('You have already unliked this post');
        }
    }
}