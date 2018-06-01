"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpSuccessMessage {
    constructor(message) {
        this.status = 200;
        this.message = message;
    }
}
exports.HttpSuccessMessage = HttpSuccessMessage;
class BadRequestMessage {
    constructor(message) {
        this.status = 400;
        this.message = message;
    }
}
exports.BadRequestMessage = BadRequestMessage;
class Constants {
    static get UserModelToken() { return 'UserModelToken'; }
    static get DbConnectionToken() { return 'DbConnectionToken'; }
    static get PASSWORD_ERROR() { return '密码错误'; }
    static get PASSWORD_USERNAME_ERROR() { return '用户名或密码错误'; }
    static get PLEASE_INPUT_OLDPASSWORD() { return '请输入旧密码'; }
    static get USERNAME_EXISTS() { return '用户名已存在'; }
    static get MAILWORD_EXISTS() { return '邮箱已存在'; }
}
exports.Constants = Constants;
//# sourceMappingURL=constants.js.map