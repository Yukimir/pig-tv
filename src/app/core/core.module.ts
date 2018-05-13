import { Module } from '@nestjs/common';
import { QQbotService } from './qqbot.service'



@Module({
    providers: [QQbotService],
    exports: [QQbotService]
})
export class CoreModule {

}