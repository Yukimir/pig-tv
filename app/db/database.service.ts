import * as Mongoose from 'mongoose'
import { User } from './database.interface'

let userSchema = new Mongoose.Schema(
    {
        qq: Mongoose.SchemaTypes.String,
        id: Mongoose.SchemaTypes.String,
        mail: Mongoose.SchemaTypes.String,
        password: Mongoose.SchemaTypes.String,
        nickname: Mongoose.SchemaTypes.String,
    },
    {
        collection: 'user'
    }
)

export class DataBaseService {
    connection: Mongoose.Connection;
    userModel: Mongoose.Model<User>
    constructor(uri: string) {
        // 在这里连接服务器
        this.connection = Mongoose.createConnection(uri);
        this.userModel = this.connection.model<User>('user', userSchema, 'user');
    }
    async findData(condition) {
        return await this.userModel.find(condition);
    }
    async createData(...doc) {
        return await this.userModel.create(doc);
    }
    async updateData(condition, doc) {
        return await this.userModel.findOneAndUpdate(condition, doc, { upsert: true })
    }

}