import { Module } from '@nestjs/common';
import { QQbotService } from './qqbot.service'
import { StreamsModule } from './streams/streams.module'
import { WsGateway } from './ws.gateway'

@Module({
    imports: [StreamsModule],
    components: [QQbotService, WsGateway]
})
export class ApplicationModule { }
