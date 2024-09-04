import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: '*',
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    const config = new DocumentBuilder()
        .setTitle('OnePiece TCG REST API with NestJS')
        .setDescription(
            'In this project we made use of the following concepts: OOP, Jest, e2e, JWT, Middlewares, internal scripts, Swagger documentation and MongoDB',
        )
        .setVersion('0.1')
        .addTag('Card', 'API endpoints for managing One Piece TCG cards')
        .addTag('Collection', 'API endpoints for managing user collection')
        .addTag('Deck', 'API endpoints for managing card decks from users')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/', app, document);

    await app.listen(3333);
}
bootstrap();
