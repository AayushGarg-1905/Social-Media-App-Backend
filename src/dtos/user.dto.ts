// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck


import { IsDefined, IsInt, IsNotEmpty, IsNumberString, IsObject, IsOptional, IsString, Length, Max, Min, IsEmail, IsEnum, IsHash, IsMongoId } from 'class-validator';
import { Expose } from 'class-transformer';
import { UserModel } from '../internal_exports';

export class UpdateUserReqDto {
    
    @IsOptional()
    @Expose()
    @IsString()
    @Length(3,15)
    userName?: string;

    @IsOptional()
    @Expose()
    @IsInt()
    @Min(1000000000, { message: 'Please enter a valid mobile number' })
    @Max(9999999999, { message: 'Please enter a valid mobile number' })
    phoneNumber?: number;
}
