import * as Mongoose from 'mongoose'

interface User extends Mongoose.Document {
    qq: string;
    nickname: string;
    sign: string;
}

let userSchema = new Mongoose.Schema(
    {
        qq: Mongoose.SchemaTypes.String,
        nickname: Mongoose.SchemaTypes.String,
        sign: Mongoose.SchemaTypes.String
    },
    {
        collection: 'user'
    }
)

export class DBHelper {
    connection: Mongoose.Connection;
    userModel: Mongoose.Model<User>
    constructor(uri: string) {
        // 在这里连接服务器
        this.connection = Mongoose.createConnection(uri);
        this.userModel = this.connection.model<User>('user', userSchema, 'user');
    }
    async findData() {
        
    }

}