import { NestFactory } from '@nestjs/core';
import { ScriptsModule } from '../scripts.module';
import { ImportCardsService } from './importCards.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(ScriptsModule);
    const scriptsService = app.get(ImportCardsService);

    // Place JSON file next to this file to import cards
    await scriptsService.insertFromFile('src/script/importCards/cards.json');

    await app.close();
}

bootstrap();
