import { Module, Global } from '@nestjs/common';
import { QQbotService } from './qqbot.service'
import { WsGateway } from './ws.gateway'
import { StreamsModule } from '../streams/streams.module'
import { databaseProviders } from './database.provider';
import { JsonWebTokenService } from './jwt.service';

@Module({
    providers: [QQbotService, WsGateway, JsonWebTokenService, ...databaseProviders],
    exports: [QQbotService, WsGateway, JsonWebTokenService, ...databaseProviders]
})
export class CoreModule {

}