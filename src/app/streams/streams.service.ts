import { Injectable } from '@nestjs/common';
import { QQbotService } from '../core/qqbot.service'
import { StreamPublishEventDto, Stream } from './streams.interface'
import * as crypto from 'crypto'
import { WsGateway } from '../core/ws.gateway'
import { UsersService } from '../users/users.service';
import * as request from 'request';

@Injectable()
export class StreamsService {
    private streams: Stream[] = [];
    private eventStore = new Map<string, Array<any>>();
    constructor(
        private readonly qqbotService: QQbotService,
        private readonly wsGateWay: WsGateway,
        private readonly usersService: UsersService
    ) {
        wsGateWay.on('request-liveStreams', (client) => {
            client.emit('liveStreams-list', this.streams);
        })
    }

    public get Streams() {
        return this.streams;
    }
    public async Publish(streamEvent: StreamPublishEventDto, ) {
        // 今后这里要加上验证stream，通过user模块来验证，之后加上streamName
        const user = await this.usersService.FindUserBySign(streamEvent.stream);
        if (user) {
            const stream: Stream = {
                id: crypto.createHash('md5').update(streamEvent.client_id.toString()).digest('hex'),
                _id: streamEvent.client_id,
                app: streamEvent.app,
                stream: streamEvent.stream,
                streamName: user.nickname
            };
            this.streams.push(stream);
            this.qqbotService.emitMessage(`【${stream.streamName}】走上了舞台，快来http://live.aigis.me:3000围观她~`);
            this.wsGateWay.BoardCast('post-publish', {
                id: stream.id,
                app: stream.app,
                stream: stream.stream,
                streamName: stream.streamName
            });
        } else {
            // 中止流的推送
            request.delete(`http://127.0.0.1:1985/api/v1/clients/${streamEvent.client_id.toString()}`).on('error', (err) => {
                console.log(err);
            });
        }
    }
    public UnPublish(streamEvent: StreamPublishEventDto) {
        const id = crypto.createHash('md5').update(streamEvent.client_id.toString()).digest('hex');
        let i = this.streams.findIndex((v) => {
            return v.id === id;
        })
        if (i !== -1) {
            this.streams.splice(i, 1);
            this.wsGateWay.BoardCast('done-publish', id);
        }
    }
}