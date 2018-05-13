import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app/app.module';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
    const app = await NestFactory.create(ApplicationModule);
    app.use(express.static(path.join(__dirname, 'public')))
    app.useGlobalFilters({
        catch: (e: any, res: any) => {
            console.log(e);
        }
    })
    await app.listen(3000);
}
bootstrap();