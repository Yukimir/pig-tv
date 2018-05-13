import { Controller, Post, Req, Res, Body } from '@nestjs/common'
import { StreamPublishEventDto } from './streams.interface'

@Controller('api/streams')
export class StreamsController {
    @Post()
    newStream(@Body() body: StreamPublishEventDto) {
        console.log(body);
        if (body.action === 'on_publish') {
            
        }
        if (body.action === 'on_unpublish') {

        }
    }
}