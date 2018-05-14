import { WebSocketGateway, SubscribeMessage, WebSocketServer, WsResponse, OnGatewayInit } from '@nestjs/websockets';
import { Injectable } from '@nestjs/common'
import { Server, Socket } from 'socket.io';
import { StreamsService } from '../streams/streams.service'
import { QQbotService } from './qqbot.service'

export class WsEventMap {
    'request-liveStreams': Socket = null;
}

@Injectable()
@WebSocketGateway()
export class WsGateway implements OnGatewayInit {
    private audienceCount = 0;
    private eventStore = new Map<string, Array<any>>();
    public get AudienceCount() {
        return this.audienceCount;
    }
    public set AudienceCount(v: number) {
        this.audienceCount = v;
        this.BoardCast('update-pig', this.audienceCount);
    }
    @WebSocketServer()
    private server: Server;

    constructor(
        private readonly qqbotService: QQbotService
    ) {
        for (let key in (new WsEventMap())) {
            this.eventStore.set(key, []);
        }
    }
    afterInit() {
        const self = this;
    }
    @SubscribeMessage('request-liveStreams')
    onRequestLiveStreams(client: Socket, data) {
        this.AudienceCount = this.AudienceCount + 1;
        this.dispatch('request-liveStreams', client);
    }

    @SubscribeMessage('se')
    onSe(client: Socket, data) {
        this.BoardCast('se', data);
    }

    @SubscribeMessage('disconnect')
    onDisconnect(client: Socket, data) {
        this.audienceCount -= 1;
        this.AudienceCount = this.audienceCount < 0 ? 0 : this.audienceCount;
    }
    BoardCast(channel: string, message: any) {
        this.server.emit(channel, message);
    }

    public on<K extends keyof WsEventMap>(type: K, cb: (event: WsEventMap[K]) => any) {
        this.eventStore.get(type).push(cb);
    }
    private dispatch<K extends keyof WsEventMap>(type: K, event: WsEventMap[K]) {
        const list = this.eventStore.get(type);
        if (list) {
            for (const fn of list) {
                fn(event);
            }
        }
    }
}