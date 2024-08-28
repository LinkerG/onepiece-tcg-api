import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import mongoose, { mongo } from 'mongoose';
import { AppModule } from './../src/app.module';
import { CreateCardDto } from '../src/card/dto/create-card.dto';
import { CardAttribute, CardColor, CardType, Rarity } from '../src/card/schemas/card.schema';

// Load environment variables from .env file
import * as dotenv from 'dotenv';
describe('Book & Auth Controller (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    beforeAll(async () => {
        await mongoose.connect(process.env.TEST_URI);
        await mongoose.connection.db.dropDatabase();
    });

    afterAll(() => mongoose.disconnect());

    const user = {
        name: 'test',
        email: 'test@gmail.com',
        password: 'test',
    };

    const card = {
        card_id: 'card1',
        name: 'Test Card',
        rarity: Rarity.COMMON,
        type: CardType.CHARACTER,
        attribute: [CardAttribute.RANGED],
        power: 500,
        counter: 0,
        color: [CardColor.RED],
        card_type: ["Straw Hat Crew"],
        effect: 'Test Effect',
        alternate_art: 0,
    };

    let jwtToken: string = '';
    let cardCreated;

    describe('Auth', () => {
        it('(POST) - Register a new user', async () => {
            return request(app.getHttpServer())
                .post('/auth/signup')
                .send(user)
                .expect(201)
                .then((res) => {
                    expect(res.body.token).toBeDefined();
                });
        });

        it('(GET) - Login user', async () => {
            return request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: user.email, password: user.password })
                .expect(200)
                .then((res) => {
                    expect(res.body.token).toBeDefined();
                    jwtToken = res.body.token;
                });
        });
    });

    describe('Card Creation and Retrieval', () => {
        it('(POST) - Create new Card', async () => {
            return request(app.getHttpServer())
                .post('/card')
                .set('Authorization', `Bearer ${jwtToken}`)
                .send(card)
                .expect(201)
                .then((res) => {
                    console.log('Create Card Response:', res.body); // Debug log
                    expect(res.body.card_id).toEqual(card.card_id);
                    cardCreated = res.body; // Save the created card
                });
        });

        it('(GET) - Get all Cards', async () => {
            return request(app.getHttpServer())
                .get('/card')
                .set('Authorization', `Bearer ${jwtToken}`) // Ensure token is included
                .expect(200)
                .then((res) => {
                    expect(res.body).toBeInstanceOf(Array);
                    expect(res.body.length).toBeGreaterThan(0);
                });
        });

        it('(GET) - Get a Card by ID', async () => {
            return request(app.getHttpServer())
                .get(`/card/${cardCreated.card_id}`)
                .set('Authorization', `Bearer ${jwtToken}`) // Ensure token is included
                .expect(200)
                .then((res) => {
                    expect(res.body.card_id).toEqual(cardCreated.card_id);
                });
        });

        it('(PATCH) - Increase alternate_art', async () => {
            return request(app.getHttpServer())
                .patch(`/card/${cardCreated.card_id}/addAlteredArt`)
                .set('Authorization', `Bearer ${jwtToken}`)
                .expect(200)
                .then((res) => {
                    expect(res.body.alternate_art).toBe(1);
                });
        });

        it('(PATCH) - Decrease alternate_art', async () => {
            return request(app.getHttpServer())
                .patch(`/card/${cardCreated.card_id}/removeAlteredArt`)
                .set('Authorization', `Bearer ${jwtToken}`)
                .expect(200)
                .then((res) => {
                    expect(res.body.alternate_art).toBe(0);
                });
        });

        it('(POST) - Create Card without token should return 401', async () => {
            return request(app.getHttpServer())
                .post('/card')
                .send(card)
                .expect(401);
        });

        it('(PATCH) - Increase alternate_art without token should return 401', async () => {
            return request(app.getHttpServer())
                .patch(`/card/${cardCreated.card_id}/addAlteredArt`)
                .expect(401);
        });

        it('(PATCH) - Decrease alternate_art without token should return 401', async () => {
            return request(app.getHttpServer())
                .patch(`/card/${cardCreated.card_id}/removeAlteredArt`)
                .expect(401);
        });
    });
});