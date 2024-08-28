import { Test, TestingModule } from '@nestjs/testing';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { Card, CardAttribute, CardColor, CardType, Rarity } from './schemas/card.schema';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

describe('CardController', () => {
    let controller: CardController;
    let service: jest.Mocked<CardService>;

    const mockCardService = {
        find: jest.fn(),
        findById: jest.fn(),
        addAlternateArt: jest.fn(),
        removeAlternateArt: jest.fn(),
        create: jest.fn(),
    };

    const mockCardDto: CreateCardDto = {
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

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CardController],
            providers: [
                {
                    provide: CardService,
                    useValue: mockCardService,
                },
            ],
        })
            .overrideGuard(AuthGuard('jwt'))
            .useValue({ canActivate: jest.fn().mockReturnValue(true) })
            .compile();

        controller = module.get<CardController>(CardController);
        service = module.get(CardService);
    });

    afterEach(() => {
        jest.clearAllMocks(); // Limpia los mocks después de cada prueba
    });

    describe('findAll', () => {
        it('should return an array of cards', async () => {
            const mockCards: Card[] = [{ card_id: 'card1' }, { card_id: 'card2' }] as Card[];
            service.find.mockResolvedValue(mockCards);

            const result = await controller.findAll({});
            expect(result).toEqual(mockCards);
            expect(service.find).toHaveBeenCalledWith({});
        });
    });

    describe('findById', () => {
        it('should return a card by id', async () => {
            const mockCard = { card_id: 'card1' } as Card;
            service.findById.mockResolvedValue(mockCard);

            const result = await controller.findById('card1');
            expect(result).toEqual(mockCard);
            expect(service.findById).toHaveBeenCalledWith('card1');
        });

        it('should throw NotFoundException if card is not found', async () => {
            service.findById.mockRejectedValue(new NotFoundException());

            await expect(controller.findById('card1')).rejects.toThrow(NotFoundException);
        });
    });

    describe('addAlternateArt', () => {
        it('should increase alternate_art and return the updated card', async () => {
            const mockCard = { card_id: 'card1', alternate_art: 1 } as Card;
            service.addAlternateArt.mockResolvedValue(mockCard);

            const result = await controller.addAlternateArt('card1');
            expect(result).toEqual(mockCard);
            expect(service.addAlternateArt).toHaveBeenCalledWith('card1');
        });
    });

    describe('removeAlternateArt', () => {
        it('should decrease alternate_art and return the updated card', async () => {
            const mockCard = { card_id: 'card1', alternate_art: 0 } as Card;
            service.removeAlternateArt.mockResolvedValue(mockCard);

            const result = await controller.removeAlternateArt('card1');
            expect(result).toEqual(mockCard);
            expect(service.removeAlternateArt).toHaveBeenCalledWith('card1');
        });
    });

    describe('create', () => {
        it('should create a new card and return it', async () => {

            const mockCard = { ...mockCardDto } as Card;
            service.create.mockResolvedValue(mockCard);

            const result = await controller.create(mockCardDto);
            expect(result).toEqual(mockCard);
            expect(service.create).toHaveBeenCalledWith(mockCardDto);
        });

        it('should throw BadRequestException if card already exists', async () => {
            service.create.mockRejectedValue(new BadRequestException());

            await expect(controller.create(mockCardDto)).rejects.toThrow(BadRequestException);
        });
    });
});
