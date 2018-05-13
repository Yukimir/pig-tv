import { Module } from '@nestjs/common';
import { StreamsModule } from './streams/streams.module'
import { CoreModule } from './core/core.module'

@Module({
    imports: [
        CoreModule,
        StreamsModule
    ]
})
export class ApplicationModule { }
