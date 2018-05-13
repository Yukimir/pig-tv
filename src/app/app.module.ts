import { Module } from '@nestjs/common';
import { StreamsModule } from './streams/streams.module'
import { CoreModule } from './core/core.module'
import { WsGateway } from './ws.gateway'

@Module({
    imports: [
        CoreModule,
        StreamsModule
    ],
    providers: [WsGateway]
})
export class ApplicationModule { }
