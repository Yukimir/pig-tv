"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mongoose = require("mongoose");
let userSchema = new Mongoose.Schema({
    qq: Mongoose.SchemaTypes.String,
    id: Mongoose.SchemaTypes.String,
    mail: Mongoose.SchemaTypes.String,
    password: Mongoose.SchemaTypes.String,
    nickname: Mongoose.SchemaTypes.String,
}, {
    collection: 'user'
});
class DataBaseService {
    constructor(uri) {
        this.connection = Mongoose.createConnection(uri);
        this.userModel = this.connection.model('user', userSchema, 'user');
    }
    findData(condition) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userModel.find(condition);
        });
    }
    createData(...doc) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userModel.create(doc);
        });
    }
    updateData(condition, doc) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userModel.findOneAndUpdate(condition, doc, { upsert: true });
        });
    }
}
exports.DataBaseService = DataBaseService;
//# sourceMappingURL=database.service.js.map