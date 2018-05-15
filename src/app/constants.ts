export class HttpSuccessMessage {
    status: number = 200;
    message: any;
    constructor(message: any) {
        this.message = message;
    }
}

export class BadRequestMessage {
    status: number = 400;
    message: any;
    constructor(message: any) {
        this.message = message;
    }
}

export class Constants {
    public static get UserModelToken() { return 'UserModelToken' }
    public static get DbConnectionToken() { return 'DbConnectionToken' }

    public static get PASSWORD_ERROR() { return '密码错误' }
    public static get PASSWORD_USERNAME_ERROR() { return '用户名或密码错误' }
    public static get PLEASE_INPUT_OLDPASSWORD() { return '请输入旧密码' }

    public static get USERNAME_EXISTS() { return '用户名已存在' }
    public static get MAILWORD_EXISTS() { return '邮箱已存在' }
}