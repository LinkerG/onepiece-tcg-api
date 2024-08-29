import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserHasCardDTO {
    @IsNotEmpty()
    @ApiProperty({ description: 'The ID of the card', example: 'EB01-001' })
    card_id: string;

    @IsNotEmpty()
    @ApiProperty({ description: 'The amount of this card', example: 1 })
    quantity: number;
}
