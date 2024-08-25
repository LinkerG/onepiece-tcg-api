import { NestFactory } from '@nestjs/core';
import { ScriptsModule } from './scripts.module';
import { ScriptsService } from './scripts.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(ScriptsModule);
    const scriptsService = app.get(ScriptsService);

    await scriptsService.insertFromFile('src/scripts/cards.json');

    await app.close();
}

bootstrap();
