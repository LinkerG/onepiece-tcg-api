import { forwardRef, Module } from '@nestjs/common';
import { DeckController } from './deck.controller';
import { DeckService } from './deck.service';
import { CacheModule } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { Deck, DeckSchema } from './schemas/deck.schema';

@Module({
    imports: [
        CacheModule.register({
            ttl: 5000, // milliseconds
            max: 100,
        }),
        MongooseModule.forFeature([
            { name: Deck.name, schema: DeckSchema },
        ]),
        forwardRef(() => AuthModule),
    ],
    controllers: [DeckController],
    providers: [DeckService]
})
export class DeckModule { }
