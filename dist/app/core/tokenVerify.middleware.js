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
const jwt_service_1 = require("./jwt.service");
const constants_1 = require("../constants");
const users_service_1 = require("../users/users.service");
let TokenVerifyMiddleware = class TokenVerifyMiddleware {
    constructor(jwt, usersService) {
        this.jwt = jwt;
        this.usersService = usersService;
    }
    resolve(...args) {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let obj;
                if (!req.body['token'] || !(obj = this.jwt.Verify(req.body['token'])))
                    throw 'no token';
                if (!obj._id || !obj.password)
                    throw 'no id or password';
                const user = yield this.usersService.FindUser(obj._id, true);
                if (!user || user.password !== obj.password)
                    throw 'password error';
                req.body['token'] = obj;
                next();
            }
            catch (err) {
                res.status(400).send(new constants_1.BadRequestMessage(err));
            }
        });
    }
};
TokenVerifyMiddleware = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [jwt_service_1.JsonWebTokenService,
        users_service_1.UsersService])
], TokenVerifyMiddleware);
exports.TokenVerifyMiddleware = TokenVerifyMiddleware;
//# sourceMappingURL=tokenVerify.middleware.js.map