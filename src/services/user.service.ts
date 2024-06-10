import { ObjectId, Types } from "mongoose";
import { BadRequestError } from "../config/error";
import { AuthDto, UserModel, EncryptionService, DatabaseService, CommonUtils, PassportModel, UserDto } from "../internal_exports";

export default class UserService {
    protected encryptionService: EncryptionService.default
    protected databaseService: DatabaseService.default
    constructor() {
        this.encryptionService = new EncryptionService.default();
        this.databaseService = new DatabaseService.default();
    }

    public async updateUser(params: UserDto.UpdateUserReqDto, userId: Types.ObjectId){
        const { phoneNumber, userName } = params;
        const { user } = await this.validateUpdateUser(userId);

        if(phoneNumber){
            user.phoneNumber = phoneNumber;
        }
        if(userName){
            user.userName = userName;
        }
        await user.save();
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
       return user;
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

}