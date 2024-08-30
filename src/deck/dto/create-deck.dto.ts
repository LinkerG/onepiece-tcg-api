import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class CreateCardDTO {
    @ApiProperty({
        description: 'Unique identifier for the card',
        example: 'card_123',
    })
    @IsString()
    @IsNotEmpty()
    card_id: string;

    @ApiProperty({
        description: 'Quantity of this card in the deck',
        example: 2,
    })
    @IsNotEmpty()
    quantity: number;
}

export class CreateUserDeckDTO {
    @ApiProperty({
        description: 'Name of the deck',
        example: 'My Awesome Deck',
    })
    @IsString()
    @IsNotEmpty()
    deck_name: string;

    @ApiProperty({
        description: 'Leader of the deck',
        example: 'Leader_1',
    })
    @IsString()
    @IsNotEmpty()
    leader: string;

    @ApiProperty({
        type: [CreateCardDTO],
        description: 'List of cards in the deck',
    })
    @ValidateNested({ each: true })
    @Type(() => CreateCardDTO)
    @IsArray()
    deck_cards: CreateCardDTO[];
}

export class CreateDeckDTO {
    user_id: string;

    @ApiProperty({
        description: 'Details of the user deck',
        type: CreateUserDeckDTO,
    })
    @ValidateNested()
    @Type(() => CreateUserDeckDTO)
    deck: CreateUserDeckDTO;
}
