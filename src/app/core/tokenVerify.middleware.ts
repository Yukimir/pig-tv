import { Injectable, NestMiddleware, MiddlewareFunction } from '@nestjs/common';
import { JsonWebTokenService } from './jwt.service';
import { Request, Response } from 'express';

@Injectable()
export class TokenVerifyMiddleware implements NestMiddleware {
    constructor(private readonly jwt: JsonWebTokenService) {

    }
    resolve(...args: any[]): MiddlewareFunction {
        return (req: Request, res: Response, next) => {
            let obj;
            if (req.body['token'] && (obj = this.jwt.Verify(req.body['token']))) {
                req.body['token'] = obj;
                next();
            } else {
                res.sendStatus(400);
            }
        }
    }
}