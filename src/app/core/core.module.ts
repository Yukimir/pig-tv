import { Module, Global } from '@nestjs/common';
import { QQbotService } from './qqbot.service'
import { WsGateway } from './ws.gateway'


@Global()
@Module({
    providers: [QQbotService, WsGateway],
    exports: [QQbotService, WsGateway]
})
export class CoreModule {

}