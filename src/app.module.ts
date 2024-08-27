import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CardModule } from './card/card.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScriptsModule } from './scripts/scripts.module';
import { RemoveHeaderMiddleware } from './middleware/remove-header.middleware';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        MongooseModule.forRoot(process.env.MONGO_URI),
        CardModule,
        ScriptsModule,
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(RemoveHeaderMiddleware)
            .forRoutes('*');
    }
}
