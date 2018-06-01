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
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class loginDto {
}
exports.loginDto = loginDto;
class regDto {
}
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], regDto.prototype, "username", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], regDto.prototype, "password", void 0);
__decorate([
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], regDto.prototype, "mail", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], regDto.prototype, "nickname", void 0);
exports.regDto = regDto;
class modifyDto {
}
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], modifyDto.prototype, "nickname", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], modifyDto.prototype, "password", void 0);
exports.modifyDto = modifyDto;
class modifyRequestDto {
}
__decorate([
    class_validator_1.ValidateNested(),
    class_transformer_1.Type(() => modifyDto),
    __metadata("design:type", modifyDto)
], modifyRequestDto.prototype, "update", void 0);
exports.modifyRequestDto = modifyRequestDto;
class userSessionDto {
}
exports.userSessionDto = userSessionDto;
//# sourceMappingURL=users.model.js.map