import { Injectable } from '@nestjs/common';
import { QQbotService } from '../core/qqbot.service'
import { StreamPublishEventDto, Stream, StreamEventMap } from './streams.interface'
import * as crypto from 'crypto'
import { WsGateway } from '../core/ws.gateway'

@Injectable()
export class StreamsService {
    private streams: Stream[] = [];
    private eventStore = new Map<string, Array<any>>();
    constructor(
        private readonly qqbotService: QQbotService,
    ) {
        for (let key in (new StreamEventMap())) {
            this.eventStore.set(key, []);
        }
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
        this.dispatch('publish', stream);

    }
    public UnPublish(streamEvent: StreamPublishEventDto) {
        const id = crypto.createHash('md5').update(streamEvent.client_id.toString()).digest('hex');
        let i = this.streams.findIndex((v) => {
            return v.id === id;
        })
        if (i !== -1) {
            this.streams.splice(i, 1);
            this.dispatch('unpublish', id);
        }
    }

    public on<K extends keyof StreamEventMap>(type: K, cb: (event: StreamEventMap[K]) => any) {
        this.eventStore.get(type).push(cb);
    }
    private dispatch<K extends keyof StreamEventMap>(type: K, event: StreamEventMap[K]) {
        const list = this.eventStore.get(type);
        if (list) {
            for (const fn of list) {
                fn(event);
            }
        }
    }
}