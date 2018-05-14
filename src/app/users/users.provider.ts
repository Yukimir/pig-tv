import { Connection } from "mongoose";
import { UserSchemas } from "./schemas/user.schemas";
import { Constants } from '../constants'

export const UsersProvider = [
    {
        provide: Constants.UserModelToken,
        useFactory: (connection: Connection) => connection.model('user', UserSchemas),
        inject: [Constants.DbConnectionToken]
    }
]