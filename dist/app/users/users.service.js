"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
const constants_1 = require("../constants");
const mongoose_1 = require("mongoose");
const jwt_service_1 = require("../core/jwt.service");
let UsersService = class UsersService {
    constructor(userModel, jwtService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
    }
    FindUser(_id, withPassword = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (withPassword) {
                return yield this.userModel.findById(_id, { _id: false, __v: false }).exec();
            }
            else {
                return yield this.userModel.findById(_id, { password: false, _id: false, __v: false }).exec();
            }
        });
    }
    AddUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let usernameC = yield this.userModel.findOne({ username: user.username }).exec();
            let mailC = yield this.userModel.findOne({ mail: user.mail }).exec();
            if (usernameC)
                throw constants_1.Constants.USERNAME_EXISTS;
            if (mailC)
                throw constants_1.Constants.MAILWORD_EXISTS;
            user.password = crypto.createHash('md5').update(user.password).digest('hex');
            try {
                const createdUser = new this.userModel(user);
                createdUser.sign = crypto.createHash('md5').update(user.username).digest('hex');
                return yield createdUser.save();
            }
            catch (err) {
                throw err;
            }
        });
    }
    ModifyUser(_id, modify) {
        return __awaiter(this, void 0, void 0, function* () {
            if (modify.password === '')
                delete modify.password;
            if (modify.password !== undefined) {
                if (!modify.oldPassword)
                    throw constants_1.Constants.PLEASE_INPUT_OLDPASSWORD;
                modify.oldPassword = crypto.createHash('md5').update(modify.oldPassword).digest('hex');
                const user = yield this.userModel.findById(_id);
                if (user.password !== modify.oldPassword)
                    throw constants_1.Constants.PASSWORD_ERROR;
                modify.password = crypto.createHash('md5').update(modify.password).digest('hex');
            }
            try {
                return yield this.userModel.findByIdAndUpdate(_id, modify, { new: true });
            }
            catch (err) {
                throw err;
            }
        });
    }
    Login(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                user.password = crypto.createHash('md5').update(user.password).digest('hex');
                let userInfo = yield this.userModel.findOne(user);
                return userInfo;
            }
            catch (err) {
                throw err;
            }
        });
    }
    FindUserBySign(sign) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userModel.findOne({ sign });
        });
    }
    GenToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user._id || !user.password) {
                user = yield this.FindUser(user._id, true);
            }
            return this.jwtService.Sign({
                _id: user._id,
                password: user.password
            });
        });
    }
};
UsersService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(constants_1.Constants.UserModelToken)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        jwt_service_1.JsonWebTokenService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map