import { Module } from '@nestjs/common';
import { StreamsController } from './streams.controller'
import { StreamsService } from './streams.service'
import { CoreModule } from '../core/core.module'
import { UsersModule } from '../users/users.module';

@Module({
    imports: [CoreModule, UsersModule],
    controllers: [StreamsController],
    providers: [StreamsService],
    exports: [StreamsService]
})
export class StreamsModule {

}