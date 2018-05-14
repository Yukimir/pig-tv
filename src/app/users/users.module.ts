import { Module, Global } from '@nestjs/common';
import { UsersService } from './users.service'
import { UsersController } from './users.controller';
import { CoreModule } from '../core/core.module';
import { UsersProvider } from './users.provider';

@Module({
    imports: [CoreModule],
    providers: [
        UsersService,
        ...UsersProvider
    ],
    controllers: [UsersController],
    exports: [UsersService, ...UsersProvider]
})
export class UsersModule {

}