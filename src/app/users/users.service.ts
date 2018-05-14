import { Injectable, Inject } from '@nestjs/common';
import { modifyDto, regDto, loginDto } from './users.model';
import * as crypto from 'crypto'
import { ObjectID } from 'bson';
import { Constants } from '../constants'
import { Model } from 'mongoose';
import { User } from './users.interface';


@Injectable()
export class UsersService {

    constructor(@Inject(Constants.UserModelToken) private readonly userModel: Model<User>) {

    }
    public async FindUser(_id: string) {
        return await this.userModel.findById(_id, { password: false, _id: false, __v: false }).exec();
    }
    public async AddUser(user: regDto) {
        // 先检查是否重复注册
        let usernameC = await this.userModel.findOne({ username: user.username }).exec();
        let mailC = await this.userModel.findOne({ mail: user.mail }).exec();

        if (usernameC) throw "Have User";
        if (mailC) throw "Have Mail";

        // 密码记得md5一下
        user.password = crypto.createHash('md5').update(user.password).digest('hex');

        try {
            const createdUser = new this.userModel(user);
            createdUser.sign = crypto.createHash('md5').update(user.username).digest('hex');
            return await createdUser.save();
        }
        catch (err) {
            throw err;
        }
    }
    public async ModifyUser(_id: string, modify: modifyDto) {
        try {
            return await this.userModel.findByIdAndUpdate(_id, modify);
        } catch (err) {
            throw err;
        }
    }
    public async Login(user: loginDto) {
        try {
            // 密码记得md5一下
            user.password = crypto.createHash('md5').update(user.password).digest('hex');
            let userInfo = await this.userModel.findOne(user);
            return userInfo;
        } catch (err) {
            throw err;
        }
    }

    public async FindUserBySign(sign: string) {
        return await this.userModel.findOne(sign);
    }
}