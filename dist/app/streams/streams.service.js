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
const qqbot_service_1 = require("../core/qqbot.service");
const crypto = require("crypto");
const ws_gateway_1 = require("../core/ws.gateway");
const users_service_1 = require("../users/users.service");
const request = require("request");
let StreamsService = class StreamsService {
    constructor(qqbotService, wsGateWay, usersService) {
        this.qqbotService = qqbotService;
        this.wsGateWay = wsGateWay;
        this.usersService = usersService;
        this.streams = [];
        this.eventStore = new Map();
        wsGateWay.on('request-liveStreams', (client) => {
            client.emit('liveStreams-list', this.streams);
        });
    }
    get Streams() {
        return this.streams;
    }
    Publish(streamEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersService.FindUserBySign(streamEvent.stream);
            if (user) {
                const stream = {
                    id: crypto.createHash('md5').update(streamEvent.client_id.toString()).digest('hex'),
                    _id: streamEvent.client_id,
                    app: streamEvent.app,
                    stream: streamEvent.stream,
                    streamName: user.nickname
                };
                this.streams.push(stream);
                this.qqbotService.emitMessage(`母猪【${stream.streamName}】走上了舞台，快来http://pigtv.moe:3000 围观她~`);
                this.wsGateWay.BoardCast('post-publish', {
                    id: stream.id,
                    app: stream.app,
                    stream: stream.stream,
                    streamName: stream.streamName
                });
            }
            else {
                request.delete(`http://127.0.0.1:1935/api/v1/clients/${streamEvent.client_id.toString()}`).on('error', (err) => {
                    console.log(err);
                });
            }
        });
    }
    UnPublish(streamEvent) {
        const id = crypto.createHash('md5').update(streamEvent.client_id.toString()).digest('hex');
        let i = this.streams.findIndex((v) => {
            return v.id === id;
        });
        if (i !== -1) {
            this.streams.splice(i, 1);
            this.wsGateWay.BoardCast('done-publish', id);
        }
    }
};
StreamsService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [qqbot_service_1.QQbotService,
        ws_gateway_1.WsGateway,
        users_service_1.UsersService])
], StreamsService);
exports.StreamsService = StreamsService;
//# sourceMappingURL=streams.service.js.map