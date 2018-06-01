"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const jwt = require("jsonwebtoken");
let JsonWebTokenService = class JsonWebTokenService {
    constructor() {
        this.sign = 'I have a dream.';
    }
    Sign(object) {
        return jwt.sign(object, this.sign, {
            expiresIn: '24h'
        });
    }
    Verify(token) {
        try {
            return jwt.verify(token, this.sign);
        }
        catch (err) {
            return null;
        }
    }
};
JsonWebTokenService = __decorate([
    common_1.Injectable()
], JsonWebTokenService);
exports.JsonWebTokenService = JsonWebTokenService;
//# sourceMappingURL=jwt.service.js.map