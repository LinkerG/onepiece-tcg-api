import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Card, CardSchema } from '../card/schemas/card.schema';
import { CardModule } from '../card/card.module';
import { ConfigModule } from '@nestjs/config';
import { ImportCardsService } from './importCards/importCards.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        MongooseModule.forRoot(process.env.MONGO_URI),
        MongooseModule.forFeature(
            [{ name: Card.name, schema: CardSchema }]
        ),
        CardModule,
    ],
    providers: [
        ImportCardsService,
    ],
    exports: [
        ImportCardsService,
    ],
})
export class ScriptsModule { }
