import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CardModule } from './card/card.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScriptsModule } from './script/scripts.module';
import { RemoveHeaderMiddleware } from './middleware/remove-header.middleware';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        MongooseModule.forRoot(process.env.NODE_ENV === "test" ? process.env.TEST_URI : process.env.MONGO_URI),
        CardModule,
        ScriptsModule,
        AuthModule,
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(RemoveHeaderMiddleware)
            .forRoutes('*');
    }
}
