import { CacheModule } from '@nestjs/cache-manager';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { Collection, CollectionSchema } from './schemas/collection.schema';

@Module({
    imports: [
        CacheModule.register({
            ttl: 5000, // milliseconds
            max: 100,
        }),
        MongooseModule.forFeature([{ name: Collection.name, schema: CollectionSchema }]),
        forwardRef(() => AuthModule),
    ],
    controllers: [CollectionController],
    providers: [CollectionService],
    exports: [CollectionService],
})
export class CollectionModule { }
