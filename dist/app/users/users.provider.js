"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_schemas_1 = require("./schemas/user.schemas");
const constants_1 = require("../constants");
exports.UsersProvider = [
    {
        provide: constants_1.Constants.UserModelToken,
        useFactory: (connection) => connection.model('user', user_schemas_1.UserSchemas),
        inject: [constants_1.Constants.DbConnectionToken]
    }
];
//# sourceMappingURL=users.provider.js.map