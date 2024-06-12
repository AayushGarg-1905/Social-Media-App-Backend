// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { IsDefined, IsEmail, IsMongoId } from 'class-validator';
import { Expose } from 'class-transformer';

import { IsDefined, IsInt, IsNotEmpty, IsNumberString, IsObject, IsOptional, IsString, Length, Max, Min, IsEmail, IsEnum, IsHash } from 'class-validator';
import { Expose } from 'class-transformer';
import { UserModel } from '../internal_exports';
import { Types } from 'mongoose';

export class CreatePostReqDto {
    @IsOptional()
    @Expose()
    @IsString()
    @Length(2,200)
    caption: string;
}

export class UpdatePostReqDto {
    @IsDefined()
    @Expose()
    @IsMongoId()
    postId: Types.ObjectId

    @IsOptional()
    @Expose()
    @IsString()
    @Length(2,200)
    caption: string;
}

export class DeletePostReqDto {
    @IsDefined()
    @Expose()
    @IsMongoId()
    postId: Types.ObjectId
}

export class GetPostReqDto {
    @IsDefined()
    @Expose()
    @IsMongoId()
    postId: Types.ObjectId
}

export class GetUserPostsReqDto {
    @IsDefined()
    @Expose()
    @IsMongoId()
    userId: Types.ObjectId
}

export class LikePostReqDto {
    @IsDefined()
    @Expose()
    @IsMongoId()
    postId: Types.ObjectId
}

export class UnLikePostReqDto {
    @IsDefined()
    @Expose()
    @IsMongoId()
    postId: Types.ObjectId
}