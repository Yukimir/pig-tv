import { Injectable } from '@nestjs/common';
import { cqsocket } from 'node-cqsocket'

@Injectable()
export class QQbotService {
    private readonly groupID = [111438162, 376238247];
    private readonly host = '127.0.0.1';
    private readonly port = 60000;
    private readonly localPort = 60001;
    private readonly myQQ = 2745927718;
    private cq: cqsocket;
    constructor() {
        this.cq = new cqsocket(this.host, this.port);
        this.cq.listen(this.localPort);
        this.cq.on('GroupMessage', (event) => {
            // console.log(event);
            if (this.groupID.indexOf(event.ID) > -1 && Math.random() < 0.06) {
                setTimeout(() => {
                    this.cq.SendGroupMessage(event.ID, event.message);
                }, 1000);
            }
        });
        this.cq.on('PrivateMessage', (event) => {
            // console.log(event);
            if (event.qq === this.myQQ) {
                this.emitMessage(event.message);
            }
        });
    }
    emitMessage(message) {
        this.cq.SendGroupMessage(this.groupID[0], message);
    }
}