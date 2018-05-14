import { Controller, Post, Get, Body, HttpException, UsePipes, ValidationPipe } from "@nestjs/common";
import { UsersService } from "./users.service";
import { JsonWebTokenService, JsonWebToken } from "../core/jwt.service";
import { loginDto, regDto, modifyDto } from "./users.model";

@Controller()
export class UsersController {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JsonWebTokenService
    ) {

    }
    // 不需要登陆状态
    @Post('/users/reg')
    @UsePipes(new ValidationPipe({ transform: false }))
    async postReg(@Body() reg: regDto) {
        try {
            let user = await this.usersService.AddUser(reg);
            return this.jwtService.Sign({ _id: user._id })
        } catch (err) {
            throw new HttpException(err, 400);
        }
    }

    @Post('/users/login')
    async postLogin(@Body() login: loginDto) {
        // 返回token
        try {
            let user = await this.usersService.Login(login);
            if (user) {
                return this.jwtService.Sign({ _id: user._id });
            } else {
                throw new HttpException('Not Found User Or PassWord Error', 400);
            }
        } catch (err) {
            throw new HttpException(err, 400);
        }

    }

    // 需要登陆状态，通过middleware
    @Post('/user/modify')
    @UsePipes(new ValidationPipe({ transform: false }))
    async postModify(@Body() body: { token: JsonWebToken, update: modifyDto }) {
        let _id = body.token._id;
        try {
            let r = await this.usersService.ModifyUser(_id, body.update);
            return r;
        } catch (err) {
            new HttpException(err, 400);
        }
    }

    // 客户端在收到token之后应该立刻访问此接口
    @Post('/user/info')
    async getInfo(@Body() body: { token: JsonWebToken }) {
        let user = await this.usersService.FindUser(body.token._id);
        return user;
    }
}