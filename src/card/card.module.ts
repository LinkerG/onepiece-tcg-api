import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { Card, CardSchema } from './schemas/card.schema';
import { AuthModule } from '../auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
    imports: [
        CacheModule.register({
            ttl: 5000, // seconds
            max: 100,
        }),
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
