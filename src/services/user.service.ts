import { Types } from "mongoose";
import { BadRequestError } from "../config/error";
import { UserModel, EncryptionService, DatabaseService, PassportModel, UserDto, PostService, PostModel } from "../internal_exports";

export default class UserService {
    protected encryptionService: EncryptionService.default
    protected databaseService: DatabaseService.default
    protected postService: PostService.default;
    constructor() {
        this.encryptionService = new EncryptionService.default();
        this.databaseService = new DatabaseService.default();
        this.postService = new PostService.default();
    }

    public async updateUser(params: UserDto.UpdateUserReqDto, userId: Types.ObjectId){
        const { phoneNumber, userName, email, profilePicture, coverPicture } = params;
        const { user } = await this.validateUpdateUser(userId);

        if(phoneNumber){
            user.phoneNumber = phoneNumber;
        }
        if(userName){
            user.userName = userName;
        }

        const updateUserDoc = {
            email,
            phoneNumber,
            userName,
            profilePicture,
            coverPicture
        }
        await UserModel.default.updateOne({_id:userId},updateUserDoc);
        // await user.save();
    }

    public async deleteUser(userId: Types.ObjectId){
        await this.validateDeleteUser(userId);

        const session = await this.databaseService.addDbTransaction();
        await this.databaseService.handleTransaction(session, async () => {
            await UserModel.default.findOneAndDelete([{_id:userId}], { session });
            await PassportModel.default.findOneAndDelete([{userId}], { session });
        });
    }

    public async getAllUsers(){
        const users = await UserModel.default.find({});
        const userData = users.map((user)=>{
            return ({
                userName: user.userName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                gender: user.gender,
                dateOfBirth: user.dateOfBirth,
                followers: user.followers,
                following: user.following,
                profilePicture: user.profilePicture,
                coverPicture: user.coverPicture
            })
        })
        return { userData }
    }

    public async getSingleUser(params: UserDto.GetUserReqDto){
       const {user} =  await this.validateGetSingleUser(params);
       const posts = await PostModel.default.find({userId: user._id})
       const userData = {
            userId: user._id,
            userName: user.userName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            gender: user.gender,
            dateOfBirth: user.dateOfBirth,
            address: user.address,
            followers: user.followers,
            following: user.following,
            totalPosts: posts.length, 
            coverPicture: user.coverPicture,
            profilePicture: user.profilePicture
        }

        return userData;
    }

    public async followUser(params: UserDto.FollowUserReqDto, userId: Types.ObjectId){
        await this.validateFollowUser(params, userId);

        const session = await this.databaseService.addDbTransaction();
        await this.databaseService.handleTransaction(session, async () => {
            await UserModel.default.updateOne({_id: params.followerId}, {$push:{followers:userId}}, {session})
            await UserModel.default.updateOne({_id: userId}, {$push:{following: params.followerId}}, {session})
        });
    }

    public async unFollowUser(params: UserDto.UnFollowUserReqDto, userId: Types.ObjectId){
        await this.validateUnFollowUser(params, userId);

        const session = await this.databaseService.addDbTransaction();
        await this.databaseService.handleTransaction(session, async () => {
            await UserModel.default.updateOne({_id: params.followerId}, {$pull:{followers:userId}}, {session})
            await UserModel.default.updateOne({_id: userId}, {$pull:{following: params.followerId}}, {session})
        });
    }

    private async validateUpdateUser(userId: Types.ObjectId){
        const user = await UserModel.default.findOne({_id: userId});
        if(!user){
            throw new BadRequestError('User does not exist');
        }
        return {user};
    }

    private async validateDeleteUser(userId: Types.ObjectId){
        const user = await UserModel.default.findOne({_id:userId});
        if(!user){
            throw new BadRequestError('User does not exist');
        }
    }

    private async validateGetSingleUser(params: UserDto.GetUserReqDto){
        const user = await UserModel.default.findOne({_id:params.id});
        if(!user){
            throw new BadRequestError('User does not exist');
        }
        return { user };
    }

    private async validateFollowUser(params: UserDto.FollowUserReqDto, userId:Types.ObjectId){
        const followerUser = await UserModel.default.findOne({_id: params.followerId});
        if(!followerUser){
            throw new BadRequestError('Follower person does not exist');
        }
        const isAlreadyFollowing = followerUser.followers.find((person)=>person.equals(userId));
        if(isAlreadyFollowing){
            throw new BadRequestError('You are already following this person');
        }
    }

    private async validateUnFollowUser(params: UserDto.UnFollowUserReqDto, userId:Types.ObjectId){
        const followerUser = await UserModel.default.findOne({_id: params.followerId});
        if(!followerUser){
            throw new BadRequestError('Follower person does not exist');
        }
        const isAlreadyUnFollowing = followerUser.followers.find((person)=>person.equals(userId));
        if(!isAlreadyUnFollowing){
            throw new BadRequestError('You are already not following this person');
        }
    }

}