import { Types } from "mongoose";
import { BadRequestError } from "../config/error";
import { AuthDto, UserModel, EncryptionService, DatabaseService, CommonUtils, PassportModel, PostModel, PostDto, UserService, CommentModel } from "../internal_exports";

export default class PostService {
    protected encryptionService: EncryptionService.default
    protected databaseService: DatabaseService.default
    // protected userService: UserService.default;
    constructor() {
        this.encryptionService = new EncryptionService.default();
        this.databaseService = new DatabaseService.default();
        // this.userService = new UserService.default();
    }

    public async createPost(params: PostDto.CreatePostReqDto, userId: Types.ObjectId) {
        const { user } = await this.validateCreatePost(userId);

        let createPostDoc: any = {
            caption: params.caption,
            userName: user.userName,
            imageUrl: params.imageUrl,
            userId: userId
        }

        const post = await PostModel.default.create(createPostDoc);

        const postData = {
            caption: post.caption,
            userId: post.userId,
            likes: post.likes,
            comments: post.comments,
            imageUrl: post.imageUrl,
            createdAt: post.createdAt
        }
        return postData;
    }

    public async updatePost(params: PostDto.UpdatePostReqDto, userId: Types.ObjectId) {
        const { post } = await this.validateUpdatePost(params, userId);
        const { caption } = params;

        post.caption = caption || '';
        await post.save();
    }

    public async deletePost(params: PostDto.DeletePostReqDto, userId: Types.ObjectId) {

        await this.validateDeletePost(params,userId);
        const session = await this.databaseService.addDbTransaction();
        
        await this.databaseService.handleTransaction(session, async () => {
            await PostModel.default.findOneAndDelete({ _id: params.postId, userId },{session});
            await CommentModel.default.deleteMany({postId:params.postId},{session});
        });
    }

    public async getSinglePost(params: PostDto.GetPostReqDto) {
        const { post } = await this.validateGetSinglePost(params);
        return post;
    }

    public async getAllPosts() {
        
        const postsData = await PostModel.default.aggregate([
            {
                $lookup:
                {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userData",
                },
            },
            {
                $unwind:
                {
                    path: "$userData",
                },
            },
            {
                $project:
                {
                    postId: "$_id",
                    caption: 1,
                    userName: "$userData.userName",
                    userProfilePicture:"$userData.profilePicture",
                    userId: 1,
                    likes: 1,
                    comments: 1,
                    imageUrl: 1,
                    createdAt: 1,
                },
            },
            {
                $sort:
                {
                    createdAt: -1,
                },
            },
        ])

        return { postsData };
    }

    public async getAllUserPosts(params: PostDto.GetUserPostsReqDto) {

        const { user } = await this.validateGetAllUserPosts(params.userId); 
        const posts = await PostModel.default.find({ userId: params.userId }).sort({ createdAt: -1 });
        const postsData = posts.map((post) => {
            return {
                postId: post._id,
                caption: post.caption,
                userName: user.userName,
                userProfilePicture: user.profilePicture,
                userId: post.userId,
                likes: post.likes,
                comments: post.comments,
                imageUrl: post.imageUrl,
                createdAt: post.createdAt
            }
        })
        return { postsData };
    }

    public async likePost(params: PostDto.LikePostReqDto, userId: Types.ObjectId) {
        await this.validateLikePost(params, userId);
        await PostModel.default.updateOne({ _id: params.postId }, { $push: { likes: userId } });
    }

    public async unLikePost(params: PostDto.LikePostReqDto, userId: Types.ObjectId) {
        await this.validateUnLikePost(params, userId);
        await PostModel.default.updateOne({ _id: params.postId }, { $pull: { likes: userId } });
    }

    private async validateCreatePost(userId: Types.ObjectId) {
        const user = await UserModel.default.findOne({ _id: userId });
        if (!user) {
            throw new BadRequestError('User does not exist');
        }
        return { user };
    }

    private async validateUpdatePost(params: PostDto.UpdatePostReqDto, userId: Types.ObjectId) {
        const post = await PostModel.default.findOne({ _id: params.postId, userId });
        if (!post) {
            throw new BadRequestError('Post does not exsist');
        }
        return { post };
    }

    private async validateGetSinglePost(params: PostDto.GetPostReqDto) {
        const post = await PostModel.default.findOne({ _id: params.postId });
        if (!post) {
            throw new BadRequestError("Post does not exist");
        }
        return { post };
    }

    private async validateLikePost(params: PostDto.LikePostReqDto, userId: Types.ObjectId) {
        const post = await PostModel.default.findOne({ _id: params.postId });
        if (!post) {
            throw new BadRequestError("Post does not exist");
        }
        const isAlreadyLiked = post.likes.find((id) => id.equals(userId));
        if (isAlreadyLiked) {
            throw new BadRequestError('You have already liked this post');
        }
    }

    private async validateUnLikePost(params: PostDto.UnLikePostReqDto, userId: Types.ObjectId) {
        const post = await PostModel.default.findOne({ _id: params.postId });
        if (!post) {
            throw new BadRequestError("Post does not exist");
        }
        const isAlreadyLiked = post.likes.find((id) => id.equals(userId));
        if (!isAlreadyLiked) {
            throw new BadRequestError('You have already unliked this post');
        }
    }

    private async validateGetAllUserPosts(userId:Types.ObjectId){
        const user = await UserModel.default.findOne({_id:userId});
        if(!user){
            throw new BadRequestError("User does not exist");
        }
        return {user};
    }

    private async validateDeletePost(params:PostDto.DeletePostReqDto, userId: Types.ObjectId){
        const post = await PostModel.default.findOne({ _id: params.postId, userId });
        if(!post){
            throw new BadRequestError('Post does not exist');
        }
    }
}