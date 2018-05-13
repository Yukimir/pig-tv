import { Module, Global } from '@nestjs/common';
import { QQbotService } from './qqbot.service'
import { WsGateway } from './ws.gateway'
import { StreamsModule } from '../streams/streams.module'

@Global()
@Module({
    imports: [StreamsModule],
    providers: [QQbotService, WsGateway],
    exports: [QQbotService, WsGateway]
})
export class CoreModule {

}