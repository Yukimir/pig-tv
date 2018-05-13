import { Controller, Post, Req, Res, Body, HttpCode } from '@nestjs/common'
import { StreamPublishEventDto } from './streams.interface'
import { StreamsService } from './streams.service'

@Controller('api/streams')
export class StreamsController {

    constructor(private readonly streamService: StreamsService) {

    }
    @HttpCode(200)
    @Post()
    newStream(@Body() body: StreamPublishEventDto) {
        if (body.action === 'on_publish') {
            this.streamService.Publish(body);
        }
        if (body.action === 'on_unpublish') {
            this.streamService.UnPublish(body);
        }
        return 0;
    }
}