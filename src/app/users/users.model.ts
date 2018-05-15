import { IsString, IsInt, IsEmail, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer'
import { JsonWebToken } from '../core/jwt.service';

export class loginDto {
    username: string;
    password: string;
}

export class regDto {
    @IsString()
    username: string;
    @IsString()
    password: string;
    @IsEmail()
    mail: string;
    @IsString()
    nickname: string;
}
export class modifyDto {
    @IsString()
    nickname?: string;
    @IsString()
    password?: string;

    oldPassword?: string;
}
export class modifyRequestDto {
    token: JsonWebToken;

    @ValidateNested()
    @Type(() => modifyDto)
    update: modifyDto;
}
export class userSessionDto {
    _id: string;
    ip?: string;
}