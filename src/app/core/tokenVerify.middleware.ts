import { Injectable, NestMiddleware, MiddlewareFunction } from '@nestjs/common';
import { JsonWebTokenService, JsonWebToken } from './jwt.service';
import { Request, Response } from 'express';
import { BadRequestMessage } from '../constants';
import { UsersService } from '../users/users.service';

@Injectable()
export class TokenVerifyMiddleware implements NestMiddleware {
    constructor(
        private readonly jwt: JsonWebTokenService,
        private readonly usersService: UsersService
    ) {

    }
    resolve(...args: any[]): MiddlewareFunction {
        return async (req: Request, res: Response, next) => {
            try {
                let obj: JsonWebToken;
                if (!req.body['token'] || !(obj = <JsonWebToken>this.jwt.Verify(req.body['token']))) throw 'no token';
                if (!obj._id || !obj.password) throw 'no id or password';
                const user = await this.usersService.FindUser(obj._id, true);
                if (!user || user.password !== obj.password) throw 'password error';

                req.body['token'] = obj;
                next();
            } catch (err) {
                res.status(400).send(new BadRequestMessage(err));
            }
        }
    }
}