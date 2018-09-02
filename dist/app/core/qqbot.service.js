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
const common_1 = require("@nestjs/common");
const node_cqsocket_1 = require("node-cqsocket");
let QQbotService = class QQbotService {
    constructor() {
        this.groupID = [111438162, 376238247];
        this.host = '127.0.0.1';
        this.port = 60000;
        this.localPort = 60001;
        this.myQQ = 2745927718;
        this.cq = new node_cqsocket_1.cqsocket(this.host, this.port);
        this.cq.listen(this.localPort);
        this.cq.on('GroupMessage', (event) => {
            if (this.groupID.indexOf(event.ID) > -1 && Math.random() < 0.01) {
                setTimeout(() => {
                    this.cq.SendGroupMessage(event.ID, event.message);
                }, 1000);
            }
        });
        this.cq.on('PrivateMessage', (event) => {
            if (event.qq === this.myQQ) {
                this.emitMessage(event.message);
            }
        });
    }
    emitMessage(message) {
        this.cq.SendGroupMessage(this.groupID[0], message);
    }
};
QQbotService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [])
], QQbotService);
exports.QQbotService = QQbotService;
//# sourceMappingURL=qqbot.service.js.map