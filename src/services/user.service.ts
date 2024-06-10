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

    private async validateUpdateUser(userId: Types.ObjectId){
        const user = await UserModel.default.findOne({_id: userId});
        if(!user){
            throw new BadRequestError('User does not exist');
        }
        return {user};
    }
}