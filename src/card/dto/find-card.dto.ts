import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { Rarity, CardType, CardColor, CardAttribute } from '../schemas/card.schema';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindAllCardsQuery {
    @ApiPropertyOptional({
        description: 'ID of the card',
        examples: {
            default: { summary: 'No filter', value: '' },
            example: { summary: 'Card ID example', value: 'EB01-001' },
        }
    })
    @IsOptional()
    @IsString()
    card_id?: string;

    @ApiPropertyOptional({
        description: 'Name of the card',
        examples: {
            default: { summary: 'No filter', value: '' },
            example: { summary: 'Card name example', value: 'Kouzuki Oden' }
        }
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({
        enum: Rarity,
        description: 'Rarity of the card',
        examples: {
            default: { summary: 'No filter', value: '' },
            example: { summary: 'Rarity example', value: Rarity.LEADER }
        }
    })
    @IsOptional()
    @IsEnum(Rarity)
    rarity?: Rarity;

    @ApiPropertyOptional({
        enum: CardType,
        description: 'Type of the card',
        examples: {
            default: { summary: 'No filter', value: '' },
            example: { summary: 'Card type example', value: CardType.LEADER }
        }
    })
    @IsOptional()
    @IsEnum(CardType)
    type?: CardType;

    @ApiPropertyOptional({
        type: [String],
        enum: CardAttribute,
        description: 'Attributes of the card',
        examples: {
            default: { summary: 'No filter', value: [] },
            example: { summary: 'Card attributes example', value: [CardAttribute.SLASH] }
        }
    })
    @IsOptional()
    @IsArray()
    @IsEnum(CardAttribute, { each: true })
    attribute?: CardAttribute[];

    @ApiPropertyOptional({
        type: [String],
        enum: CardColor,
        description: 'Colors of the card',
        examples: {
            default: { summary: 'No filter', value: [] },
            example: { summary: 'Card colors example', value: [CardColor.RED, CardColor.GREEN] }
        }
    })
    @IsOptional()
    @IsArray()
    @IsEnum(CardColor, { each: true })
    color?: CardColor[];

    @ApiPropertyOptional({
        type: [String],
        description: 'Types of the card',
        examples: {
            default: { summary: 'No filter', value: [] },
            example: { summary: 'Card types example', value: ['Land of Wano', 'Kozuki Clan'] }
        }
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    card_type?: string[];
}
