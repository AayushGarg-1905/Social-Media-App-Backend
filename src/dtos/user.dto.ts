// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck


import { IsDefined, IsInt, IsOptional, IsString, Length, Max, Min, IsMongoId, IsEmail } from 'class-validator';
import { Expose } from 'class-transformer';
import { Types } from 'mongoose';

export class UpdateUserReqDto {
    
    @IsOptional()
    @Expose()
    @IsString()
    @Length(3,15)
    userName?: string;

    @IsOptional()
    @Expose()
    @IsString()
    @IsEmail()
    email?: string;

    @IsOptional()
    @Expose()
    @IsString()
    profilePicture?: string;

    @IsOptional()
    @Expose()
    @IsString()
    coverPicture?: string;

    @IsOptional()
    @Expose()
    @IsInt()
    @Min(1000000000, { message: 'Please enter a valid mobile number' })
    @Max(9999999999, { message: 'Please enter a valid mobile number' })
    phoneNumber?: number;
}

export class GetUserReqDto {
    @IsDefined()
    @Expose()
    @IsMongoId()
    id: Types.ObjectId
}

export class FollowUserReqDto {
    @IsDefined()
    @Expose()
    @IsMongoId()
    followerId: Types.ObjectId   // id of person to which we have to follow
}

export class UnFollowUserReqDto {
    @IsDefined()
    @Expose()
    @IsMongoId()
    followerId: Types.ObjectId   // id of person to which we have to follow
}

export class GetFollowingListReqDto{
    @IsDefined()
    @Expose()
    @IsMongoId()
    userId: Types.ObjectId
}

export class GetFollowersListReqDto{
    @IsDefined()
    @Expose()
    @IsMongoId()
    userId: Types.ObjectId
}