import { Injectable } from '@nestjs/common';
import { QQbotService } from '../core/qqbot.service'
import { StreamPublishEventDto, Stream } from './streams.interface'
import * as crypto from 'crypto'
import { WsGateway } from '../core/ws.gateway'

@Injectable()
export class StreamsService {
    private streams: Stream[] = [];
    constructor(
        private readonly qqbotService: QQbotService,
        private readonly ws: WsGateway
    ) {

    }
    public get Streams() {
        return this.streams;
    }
    public async Publish(streamEvent: StreamPublishEventDto, ) {
        const stream: Stream = {
            id: crypto.createHash('md5').update(streamEvent.client_id.toString()).digest('hex'),
            app: streamEvent.app,
            stream: streamEvent.stream
        };

        // 今后这里要加上验证stream，通过user模块来验证，之后加上streamName

        this.streams.push(stream);
        this.ws.BoardCast('post-publish', stream);

    }
    public UnPublish(streamEvent: StreamPublishEventDto) {
        const id = crypto.createHash('md5').update(streamEvent.client_id.toString()).digest('hex');
        let i = this.streams.findIndex((v) => {
            return v.id === id;
        })
        if (i !== -1) {
            this.streams.splice(i, 1);
            this.ws.BoardCast('done-publish', id);
        }
    }
}