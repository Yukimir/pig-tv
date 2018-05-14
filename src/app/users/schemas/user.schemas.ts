import * as mongoose from 'mongoose';

export const UserSchemas = new mongoose.Schema({
    username: String,
    password: String,
    mail: String,
    nickname: String,
    sign: String,
    qq: String
})