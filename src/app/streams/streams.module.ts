import { Module } from '@nestjs/common';
import { StreamsController } from './streams.controller'
import { StreamsService } from './streams.service'
import { CoreModule } from '../core/core.module'

@Module({
    imports: [CoreModule],
    controllers: [StreamsController],
    providers: [StreamsService],
    exports: [StreamsService]
})
export class StreamsModule {

}