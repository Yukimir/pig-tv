import { Injectable } from "@nestjs/common";
import * as jwt from 'jsonwebtoken'

export interface JsonWebToken {
    _id: string;
    password: string;
}

@Injectable()
export class JsonWebTokenService {
    private sign = 'I have a dream.'

    public Sign(object: object) {
        return jwt.sign(object, this.sign, {
            expiresIn: '24h'
        });
    }
    public Verify(token: string) {
        try {
            return jwt.verify(token, this.sign);
        } catch (err) {
            return null;
        }
    }
}