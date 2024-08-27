import { Rarity, CardType, CardColor, CardAttribute } from '../schemas/card.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {

    @ApiProperty({
        description: 'Collection - Number of the card in the collection',
        example: 'XXX-001',
        required: true,
    })
    card_id: string;

    @ApiProperty({
        description: 'Name of the card',
        example: 'Card Name',
    })
    name: string;

    @ApiProperty({
        enum: Rarity,
        description: 'Rarity of the card',
    })
    rarity: Rarity;

    @ApiProperty({
        enum: CardType,
        description: 'Type of the card',
    })
    type: CardType;

    @ApiProperty({
        type: [String],
        enum: CardAttribute,
        description: 'Attributes of the card',
    })
    attribute: CardAttribute[];

    @ApiProperty({
        description: 'Power level of the card',
        type: Number,
        example: "4000"
    })
    power: number;

    @ApiProperty({
        description: 'Counter value for the card',
        type: Number,
        example: "1000"
    })
    counter: number;

    @ApiProperty({
        type: [String],
        enum: CardColor,
        description: 'Colors associated with the card',
    })
    color: CardColor[];

    @ApiProperty({
        type: [String],
        description: 'Types of the card',
        example: ['Straw Hat Crew']
    })
    card_type: string[];

    @ApiProperty({
        description: 'Effect or description of the card',
        example: '[OnPlay] Do this when this card is played [Trigger] Do that when this card is taken from lives',
    })
    effect: string;

    @ApiProperty({
        description: 'Alternate art version number',
        type: Number,
        example: 0,
    })
    alternate_art: number;
}
