import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CardController } from './card.controller';
import { Card, CardSchema } from './card.schema';
import { CardService } from './card.service';

@Module({
    imports: [
        MongooseModule.forFeature(
            [{ name: Card.name, schema: CardSchema }]
        ),
    ],
    controllers: [CardController],
    providers: [CardService],
    exports: [CardService],
})
export class CardModule { }
