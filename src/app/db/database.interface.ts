import * as Mongoose from 'mongoose'

export interface User extends Mongoose.Document {
    qq: string;
    id: string;
    mail: string;
    password: string;
    nickname: string;
}