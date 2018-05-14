import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { StreamsModule } from './streams/streams.module'
import { CoreModule } from './core/core.module'
import { TokenVerifyMiddleware } from './core/tokenVerify.middleware';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        CoreModule,
        StreamsModule,
        UsersModule
    ]
})
export class ApplicationModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(TokenVerifyMiddleware)
            .forRoutes('/user');
    }
}
