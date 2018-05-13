import { Injectable } from '@nestjs/common';
import { QQbotService } from '../core/qqbot.service'

@Injectable()
export class StreamsService {
    private liveStreams = [];
    private djStreams = [];
    constructor(private readonly qqbotService: QQbotService) {
    }
    public get LiveStreams() {
        return this.liveStreams;
    }
    public get DjStreams() {
        return this.djStreams;
    }
}