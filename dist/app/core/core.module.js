"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const qqbot_service_1 = require("./qqbot.service");
const ws_gateway_1 = require("./ws.gateway");
const database_provider_1 = require("./database.provider");
const jwt_service_1 = require("./jwt.service");
let CoreModule = class CoreModule {
};
CoreModule = __decorate([
    common_1.Module({
        providers: [qqbot_service_1.QQbotService, ws_gateway_1.WsGateway, jwt_service_1.JsonWebTokenService, ...database_provider_1.databaseProviders],
        exports: [qqbot_service_1.QQbotService, ws_gateway_1.WsGateway, jwt_service_1.JsonWebTokenService, ...database_provider_1.databaseProviders]
    })
], CoreModule);
exports.CoreModule = CoreModule;
//# sourceMappingURL=core.module.js.map