import { Module } from '@nestjs/common';
import { StreamsModule } from './streams/streams.module'
import { CoreModule } from './core/core.module'

@Module({
    imports: [
        CoreModule
    ]
})
export class ApplicationModule { }
