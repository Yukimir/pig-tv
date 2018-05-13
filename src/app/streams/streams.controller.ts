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
        console.log(body);
        if (body.action === 'on_publish') {

        }
        if (body.action === 'on_unpublish') {

        }
        return 0;
    }
}