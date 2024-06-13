// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { IsDefined, IsMongoId } from 'class-validator';
import { Expose } from 'class-transformer';

import { IsDefined, IsString, Length, } from 'class-validator';
import { Expose } from 'class-transformer';
import { Types } from 'mongoose';

export class CreateCommentReqDto {
    @IsDefined()
    @Expose()
    @IsString()
    @Length(2,200)
    text: string;

    @IsDefined()
    @Expose()
    @IsMongoId()
    postId: Types.ObjectId
}

export class DeleteCommentReqDto {
    @IsDefined()
    @Expose()
    @IsMongoId()
    commentId: Types.ObjectId
}

export class GetPostCommentsReqDto {
    @IsDefined()
    @Expose()
    @IsMongoId()
    postId: Types.ObjectId
}

export class UpdateCommentReqDto {
    @IsDefined()
    @Expose()
    @IsMongoId()
    commentId: Types.ObjectId

    @IsDefined()
    @Expose()
    @IsString()
    @Length(2,200)
    text: string;
}
