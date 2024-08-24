import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { Card, CardSchema } from './schemas/card.schema';

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
