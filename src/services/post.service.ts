import { Types } from "mongoose";
import { BadRequestError } from "../config/error";
import { AuthDto, UserModel, EncryptionService, DatabaseService, CommonUtils, PassportModel, PostModel, PostDto, UserService } from "../internal_exports";

export default class PostService {
    protected encryptionService: EncryptionService.default
    protected databaseService: DatabaseService.default
    // protected userService: UserService.default;
    constructor() {
        this.encryptionService = new EncryptionService.default();
        this.databaseService = new DatabaseService.default();
        // this.userService = new UserService.default();
    }

    public async createPost(params: PostDto.CreatePostReqDto, userId:Types.ObjectId){
        const { user } = await this.validateCreatePost(userId);

        const createPostDoc = {
            caption: params.caption,
            userName: user.userName,
            userId: userId
        }
        const post = await PostModel.default.create(createPostDoc);
        return post;
    }

    public async updatePost(params: PostDto.UpdatePostReqDto){
        const { post } = await this.validateUpdatePost(params);
        const {caption} = params;

        if(caption){
            post.caption = caption
        }
        await post.save();
        return post
    }

    public async deletePost(params: PostDto.DeletePostReqDto){
        
        const post = await PostModel.default.findOneAndDelete({_id:params.postId});
        if(!post){
            throw new BadRequestError("Post does not exist");
        }
    }

    public async getSinglePost(params: PostDto.GetPostReqDto){
        const { post } = await this.validateGetSinglePost(params);
        return post;
    }

    public async getAllPosts(){
        const posts = await PostModel.default.find({});
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

    public async getAllUserPosts(params: PostDto.GetUserPostsDto){
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

    private async validateCreatePost(userId: Types.ObjectId){
        const user = await UserModel.default.findOne({_id:userId});
        if(!user){
            throw new BadRequestError('User does not exist');
        }

        return {user};
    }

    private async validateUpdatePost(params: PostDto.UpdatePostReqDto){
        const post = await PostModel.default.findOne({_id: params.postId});
        if(!post){
            throw new BadRequestError('Post does not exsist');
        }
        return {post};
    }
    
    private async validateGetSinglePost(params: PostDto.GetPostReqDto){
        const post = await PostModel.default.findOne({_id: params.postId});
        if(!post){
            throw new BadRequestError("Post doens not exist");
        }
        return {post};
    }
}