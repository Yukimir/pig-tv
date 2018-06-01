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
const users_service_1 = require("./users.service");
const jwt_service_1 = require("../core/jwt.service");
const users_model_1 = require("./users.model");
const constants_1 = require("../constants");
let UsersController = class UsersController {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    postReg(reg) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield this.usersService.AddUser(reg);
                return new constants_1.HttpSuccessMessage(yield this.usersService.GenToken(user));
            }
            catch (err) {
                throw new common_1.HttpException(err, 400);
            }
        });
    }
    postLogin(login) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield this.usersService.Login(login);
                if (user) {
                    return new constants_1.HttpSuccessMessage(yield this.usersService.GenToken(user));
                }
                else {
                    throw new common_1.HttpException(constants_1.Constants.PASSWORD_USERNAME_ERROR, 400);
                }
            }
            catch (err) {
                throw new common_1.HttpException(err, 400);
            }
        });
    }
    postModify(body) {
        return __awaiter(this, void 0, void 0, function* () {
            let _id = body.token._id;
            try {
                const user = yield this.usersService.ModifyUser(_id, body.update);
                return new constants_1.HttpSuccessMessage(yield this.usersService.GenToken(user));
            }
            catch (err) {
                throw new common_1.HttpException(err, 400);
            }
        });
    }
    getInfo(body) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.usersService.FindUser(body.token._id);
            return new constants_1.HttpSuccessMessage(user);
        });
    }
};
__decorate([
    common_1.Post('/users/reg'),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: false })),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_model_1.regDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "postReg", null);
__decorate([
    common_1.Post('/users/login'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_model_1.loginDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "postLogin", null);
__decorate([
    common_1.Put('/user/modify'),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: false, skipMissingProperties: true })),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_model_1.modifyRequestDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "postModify", null);
__decorate([
    common_1.Post('/user/info'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getInfo", null);
UsersController = __decorate([
    common_1.Controller(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_service_1.JsonWebTokenService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map