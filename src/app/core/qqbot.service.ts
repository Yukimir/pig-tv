import { Injectable } from '@nestjs/common';
import { cqsocket } from 'node-cqsocket'

@Injectable()
export class QQbotService {
    private readonly groupID = 111438162;
    private readonly host = '127.0.0.1';
    private readonly port = 9001;
    private readonly localPort = 9002;
    private readonly myQQ = 2745927718;
    private cq: cqsocket;
    constructor() {
        this.cq = new cqsocket(this.host, this.port);
        this.cq.listen(this.localPort);
        this.cq.on('GroupMessage', (event) => {
            console.log(event);
            if (event.ID === this.groupID && Math.random() < 0.03) {
                this.cq.SendGroupMessage(event.ID, event.message);
            }
        });
        this.cq.on('PrivateMessage', (event) => {
            console.log('private', event);
            if (event.qq === this.myQQ) {
                this.emitMessage(event.message);
            }
        });
    }
    emitMessage(message) {
        this.cq.SendGroupMessage(this.groupID, message);
    }
}