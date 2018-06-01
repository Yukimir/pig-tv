"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.UserSchemas = new mongoose.Schema({
    username: String,
    password: String,
    mail: String,
    nickname: String,
    sign: String,
    qq: String
});
//# sourceMappingURL=user.schemas.js.map