import { IsString, IsInt, IsEmail } from 'class-validator';

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
}

export class userSessionDto {
    _id: string;
    ip?: string;
}
