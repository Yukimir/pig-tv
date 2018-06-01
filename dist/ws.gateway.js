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
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const streams_service_1 = require("./streams/streams.service");
let WsGateway = class WsGateway {
    constructor(streamsService) {
        this.streamsService = streamsService;
        this.audienceCount = 0;
    }
    get AudienceCount() {
        return this.audienceCount;
    }
    set AudienceCount(v) {
        this.audienceCount = v;
        this.BoardCast('update-pig', this.audienceCount);
    }
    onRequestLiveStreams(client, data) {
        this.AudienceCount += 1;
        console.log(this.streamsService);
        let resData = {
            liveList: this.streamsService.LiveStreams,
            djList: this.streamsService.DjStreams
        };
        console.log(resData);
        return {
            event: 'liveStreams-list',
            data: resData
        };
    }
    onSe(client, data) {
        this.BoardCast('se', data);
    }
    onDisconnect(client, data) {
        this.audienceCount -= 1;
        this.AudienceCount = this.audienceCount < 0 ? 0 : this.audienceCount;
    }
    BoardCast(channel, message) {
        this.server.emit(channel, message);
    }
};
__decorate([
    websockets_1.WebSocketServer(),
    __metadata("design:type", Object)
], WsGateway.prototype, "server", void 0);
__decorate([
    websockets_1.SubscribeMessage('request-liveStreams'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Object)
], WsGateway.prototype, "onRequestLiveStreams", null);
__decorate([
    websockets_1.SubscribeMessage('se'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WsGateway.prototype, "onSe", null);
__decorate([
    websockets_1.SubscribeMessage('disconnect'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WsGateway.prototype, "onDisconnect", null);
WsGateway = __decorate([
    common_1.Injectable(),
    websockets_1.WebSocketGateway(),
    __metadata("design:paramtypes", [streams_service_1.StreamsService])
], WsGateway);
exports.WsGateway = WsGateway;
//# sourceMappingURL=ws.gateway.js.map