import { WebSocketGateway, SubscribeMessage, WebSocketServer, WsResponse, OnGatewayInit } from '@nestjs/websockets';
import { Injectable } from '@nestjs/common'
import { Server, Socket } from 'socket.io';
import { StreamsService } from '../streams/streams.service'
import { QQbotService } from './qqbot.service'

@Injectable()
@WebSocketGateway()
export class WsGateway {
    private audienceCount = 0;
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
        private readonly streamsService: StreamsService,
        private readonly qqbotService: QQbotService
    ) {
        streamsService.on('publish', (event) => {
            this.BoardCast('post-publish', event);
        });
        streamsService.on('unpublish', (event) => {
            this.BoardCast('done-publish', event);
        })
    }

    @SubscribeMessage('request-liveStreams')
    onRequestLiveStreams(client, data): WsResponse<any> {
        this.AudienceCount += 1;
        return {
            event: 'liveStreams-list',
            data: this.streamsService.Streams
        }
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
        console.log(this);
        this.server.emit(channel, message);
    }
}