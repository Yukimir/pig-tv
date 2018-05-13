import { Module } from '@nestjs/common';
import { StreamsController } from './streams.controller'
import { StreamsService } from './streams.service'

@Module({
    imports: [],
    components: [StreamsService],
    controllers: [StreamsController]
})
export class StreamsModule {

}