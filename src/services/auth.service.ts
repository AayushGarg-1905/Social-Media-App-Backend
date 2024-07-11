import { Types } from "mongoose";
import { BadRequestError } from "../config/error";
import { AuthDto, UserModel, EncryptionService, DatabaseService, CommonUtils, PassportModel } from "../internal_exports";

export default class AuthService {
    protected encryptionService: EncryptionService.default
    protected databaseService: DatabaseService.default
    constructor() {
        this.encryptionService = new EncryptionService.default();
        this.databaseService = new DatabaseService.default();
    }

    public async registerUser(params: AuthDto.RegisterUserReqDto) {

        const salt = CommonUtils.default.getRandomBytes();
        const { passwordHash } = this.getSaltedPasswordHash(params.password, salt);
        const userDoc = {
            userName: params.userName,
            email: params.email,
            phoneNumber: params.phoneNumber,
            gender: params.gender,
            password: passwordHash,
            passwordSalt: salt
        }

        const passportDoc = {
            accessToken: this.getAccessToken(),
            email: params.email
        }

        const session = await this.databaseService.addDbTransaction();
        let user;
        await this.databaseService.handleTransaction(session, async () => {
            user = await UserModel.default.create([userDoc], { session });
            await PassportModel.default.create([{...passportDoc, userId: user[0]._id}], { session });
        });
    }

    public async loginUser(params: AuthDto.LoginUserReqDto) {
        const { user, passport } = await this.validateLoginUser(params);

        const userData = {
            accessToken: passport.accessToken,
            userId: user._id,
        }

        return { userData };
    }

    public async checkLoginUser(userId:Types.ObjectId) {
        const { user,passport } = await this.validateCheckLoginUser(userId);

        const userData = {
            accessToken: passport.accessToken,
            userId: user._id,
        }

        return { userData };
    }

    public async logoutUser(userId:Types.ObjectId) {
        await PassportModel.default.updateOne({userId:userId},{accessToken:this.getAccessToken()});
    }

    private async validateLoginUser(params: AuthDto.LoginUserReqDto) {

        const user = await UserModel.default.findOne({ email: params.email });
        if (!user) {
            throw new BadRequestError('User does not exist');
        }

        const passport = await PassportModel.default.findOne({userId: user._id});
        if(!passport){
            throw new BadRequestError('User does not exist');
        }

        const userPasswordSalt = user.passwordSalt;
        const { passwordHash } = this.getSaltedPasswordHash(params.password, userPasswordSalt);
        if (passwordHash !== user.password) {
            throw new BadRequestError('Incorrect Password, Please try again!');
        }
        return { user, passport }
    }

    private getSaltedPasswordHash(password: string, salt: string) {
        const passwordHash = this.encryptionService.md5Hash(password + salt);
        return { passwordHash }
    }

    private async validateCheckLoginUser(userId:Types.ObjectId){
        const user = await UserModel.default.findOne({ _id: userId });
        if (!user) {
            throw new BadRequestError('User does not exist');
        }
        const passport = await PassportModel.default.findOne({userId:userId});

        if(!passport){
            throw new BadRequestError('User does not exist');
        }
        return {user, passport};
    }

    // private async validateLogoutUser(userId:Typ)

    public getAccessToken() {
        return CommonUtils.default.getRandomUUid();
    }
}