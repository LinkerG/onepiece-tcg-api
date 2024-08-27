import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { Card, CardSchema } from './schemas/card.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        MongooseModule.forFeature(
            [{ name: Card.name, schema: CardSchema }]
        ),
        AuthModule,
    ],
    controllers: [CardController],
    providers: [CardService],
    exports: [CardService],
})
export class CardModule { }
