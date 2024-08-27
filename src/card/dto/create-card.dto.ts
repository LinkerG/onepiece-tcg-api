import { IsNotEmpty, IsArray, IsEnum, IsString, IsInt, Min, Max } from 'class-validator';
import { Rarity, CardType, CardColor, CardAttribute } from '../schemas/card.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {

    @IsNotEmpty({ message: 'Card ID is required' })
    @IsString({ message: 'Card ID must be a string' })
    @ApiProperty({
        description: 'Collection - Number of the card in the collection',
        example: 'XXX-001',
        required: true,
    })
    card_id: string;

    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    @ApiProperty({
        description: 'Name of the card',
        example: 'Card Name',
        required: true,
    })
    name: string;

    @IsNotEmpty({ message: 'Rarity is required' })
    @IsEnum(Rarity, { message: `Rarity must be one of the following values: ${Object.values(Rarity).join(', ')}` })
    @ApiProperty({
        enum: Rarity,
        description: 'Rarity of the card',
        required: true,
    })
    rarity: Rarity;

    @IsNotEmpty({ message: 'Type is required' })
    @IsEnum(CardType, { message: `Type must be one of the following values: ${Object.values(CardType).join(', ')}` })
    @ApiProperty({
        enum: CardType,
        description: 'Type of the card',
        required: true,
    })
    type: CardType;

    @IsNotEmpty({ message: 'Attributes are required' })
    @IsArray({ message: 'Attributes must be an array' })
    @IsEnum(CardAttribute, { each: true, message: `Attributes must be one of the following values: ${Object.values(CardAttribute).join(', ')}` })
    @ApiProperty({
        type: [String],
        enum: CardAttribute,
        description: 'Attributes of the card',
        required: true,
    })
    attribute: CardAttribute[];

    @IsNotEmpty({ message: 'Power is required' })
    @IsInt({ message: 'Power must be an integer' })
    @Min(0, { message: 'Power must be a non-negative integer' })
    @ApiProperty({
        description: 'Power level of the card',
        type: Number,
        example: 4000,
        required: true,
    })
    power: number;

    @IsNotEmpty({ message: 'Counter is required' })
    @IsInt({ message: 'Counter must be an integer' })
    @Min(0, { message: 'Counter must be a non-negative integer' })
    @ApiProperty({
        description: 'Counter value for the card',
        type: Number,
        example: 1000,
        required: true,
    })
    counter: number;

    @IsNotEmpty({ message: 'Colors are required' })
    @IsArray({ message: 'Colors must be an array' })
    @IsEnum(CardColor, { each: true, message: `Colors must be one of the following values: ${Object.values(CardColor).join(', ')}` })
    @ApiProperty({
        type: [String],
        enum: CardColor,
        description: 'Colors associated with the card',
        required: true,
    })
    color: CardColor[];

    @IsNotEmpty({ message: 'Card types are required' })
    @IsArray({ message: 'Card types must be an array' })
    @IsString({ each: true, message: 'Each card type must be a string' })
    @ApiProperty({
        type: [String],
        description: 'Types of the card',
        example: ['Straw Hat Crew'],
        required: true,
    })
    card_type: string[];

    @IsNotEmpty({ message: 'Effect is required' })
    @IsString({ message: 'Effect must be a string' })
    @ApiProperty({
        description: 'Effect or description of the card',
        example: '[OnPlay] Do this when this card is played [Trigger] Do that when this card is taken from lives',
        required: true,
    })
    effect: string;

    @IsNotEmpty({ message: 'Alternate art version number is required' })
    @IsInt({ message: 'Alternate art must be an integer' })
    @Min(0, { message: 'Alternate art version number must be a non-negative integer' })
    @ApiProperty({
        description: 'Alternate art version number',
        type: Number,
        example: 0,
        required: true,
    })
    alternate_art: number;
}
