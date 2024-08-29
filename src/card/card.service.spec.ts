import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CardService } from './card.service';
import { Card, CardColor, CardType, Rarity } from './schemas/card.schema';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('CardService', () => {
    let service: CardService;
    let model: any;

    const mockCardModel = {
        find: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn(),
        exec: jest.fn(),
        create: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CardService,
                {
                    provide: getModelToken(Card.name),
                    useValue: mockCardModel,
                },
            ],
        }).compile();

        service = module.get<CardService>(CardService);
        model = module.get(getModelToken(Card.name));
    });

    afterEach(() => {
        jest.clearAllMocks(); // Limpia los mocks después de cada prueba
    });

    describe('find', () => {
        it('should return an array of cards', async () => {
            const mockCards = [{ card_id: 'card1' }, { card_id: 'card2' }];
            model.find.mockReturnValueOnce(mockCards);

            const result = await service.find({});
            expect(result).toEqual(mockCards);
            expect(model.find).toHaveBeenCalled();
        });

        it('should throw NotFoundException if no cards found', async () => {
            model.find.mockReturnValueOnce([]);

            await expect(service.find({})).rejects.toThrow(NotFoundException);
        });
    });

    describe('findById', () => {
        it('should return a card by id', async () => {
            const mockCard = { card_id: 'card1' };
            model.findOne.mockReturnValueOnce({
                exec: jest.fn().mockResolvedValueOnce(mockCard),
            });

            const result = await service.findById('card1');
            expect(result).toEqual(mockCard);
            expect(model.findOne).toHaveBeenCalledWith({ card_id: 'card1' });
        });

        it('should throw NotFoundException if card is not found', async () => {
            model.findOne.mockReturnValueOnce({
                exec: jest.fn().mockResolvedValueOnce(null),
            });

            await expect(service.findById('card1')).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('addAlternateArt', () => {
        it('should increment alternate_art and save the card', async () => {
            const mockCard = {
                card_id: 'card1',
                alternate_art: 1,
                save: jest.fn().mockResolvedValueOnce(true),
            };
            model.findOne.mockReturnValueOnce({
                exec: jest.fn().mockResolvedValueOnce(mockCard),
            });

            const result = await service.addAlternateArt('card1');
            expect(mockCard.alternate_art).toBe(2);
            expect(mockCard.save).toHaveBeenCalled();
            expect(result).toBe(true);
        });

        it('should throw NotFoundException if card is not found', async () => {
            model.findOne.mockReturnValueOnce({
                exec: jest.fn().mockResolvedValueOnce(null),
            });

            await expect(service.addAlternateArt('card1')).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('removeAlternateArt', () => {
        it('should decrement alternate_art and save the card', async () => {
            const mockCard = {
                card_id: 'card1',
                alternate_art: 2,
                save: jest.fn().mockResolvedValueOnce(true),
            };
            model.findOne.mockReturnValueOnce({
                exec: jest.fn().mockResolvedValueOnce(mockCard),
            });

            const result = await service.removeAlternateArt('card1');
            expect(mockCard.alternate_art).toBe(1);
            expect(mockCard.save).toHaveBeenCalled();
            expect(result).toBe(true);
        });

        it('should throw NotFoundException if card is not found', async () => {
            model.findOne.mockReturnValueOnce({
                exec: jest.fn().mockResolvedValueOnce(null),
            });

            await expect(service.removeAlternateArt('card1')).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('create', () => {
        it('should throw BadRequestException if card_id already exists', async () => {
            const mockCard = { card_id: 'card1' } as Card;
            model.findOne.mockResolvedValueOnce(Promise.resolve(mockCard));

            await expect(service.create(mockCard)).rejects.toThrow(
                BadRequestException,
            );
        });
    });
});
