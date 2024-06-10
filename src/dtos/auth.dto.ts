// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { IsDefined, IsEmail } from 'class-validator';
import { Expose } from 'class-transformer';

import { IsDefined, IsInt, IsNotEmpty, IsNumberString, IsObject, IsOptional, IsString, Length, Max, Min, IsEmail, IsEnum, IsHash } from 'class-validator';
import { Expose } from 'class-transformer';
import { UserModel } from '../internal_exports';

export class RegisterUserReqDto {
    @IsDefined()
    @Expose()
    @IsString()
    @Length(3,15)
    userName: string;

    @IsDefined()
    @Expose()
    @IsEmail({},{ message: "Invalid email" })
    @IsNotEmpty({message: "Provide Email."})
    email: string;

    @IsDefined()
    @Expose()
    @IsInt()
    @Min(1000000000, { message: 'Please enter a valid mobile number' })
    @Max(9999999999, { message: 'Please enter a valid mobile number' })
    phoneNumber: number;

    @IsDefined()
    @Expose()
    @IsEnum(UserModel.Gender,{each: true})
    gender: UserModel.Gender

    @IsDefined()
    @Expose()
    @IsHash('md5')
    password: string
}

export class LoginUserReqDto {
    @IsDefined()
    @Expose()
    @IsEmail({},{ message: "Invalid email" })
    @IsNotEmpty({message: "Provide Email."})
    email: string;

    @IsDefined()
    @Expose()
    @IsHash('md5')
    password: string
}