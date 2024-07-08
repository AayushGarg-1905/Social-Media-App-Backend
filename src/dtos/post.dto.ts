// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { IsDefined, IsMongoId } from 'class-validator';
import { Expose } from 'class-transformer';

import { IsDefined, IsOptional, IsString, Length } from 'class-validator';
import { Expose } from 'class-transformer';
import { Types } from 'mongoose';

export class CreatePostReqDto {

    @IsOptional()
    @Expose()
    @IsString()
    @Length(2,200)
    caption?: string;

    @IsOptional()
    @Expose()
    @IsString()
    imageUrl?: string;
}

export class UpdatePostReqDto {
    @IsDefined()
    @Expose()
    @IsMongoId()
    postId: Types.ObjectId

    @IsOptional()
    @Expose()
    @IsString()
    @Length(0,200)
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