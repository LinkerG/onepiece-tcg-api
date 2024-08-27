import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CardService } from './card.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Card, CardAttribute, CardColor, CardType, Rarity } from './schemas/card.schema';
import { FindAllCardsQuery } from './dto/find-card.dto';

@Controller('card')
@ApiTags('Card')
export class CardController {
    constructor(private readonly cardService: CardService) { }

    @Get()
    @ApiOperation({ description: 'Get cards matching parameters' })
    //@ApiQuery({ name: 'Query parameters', type: FindAllCardsQuery, required: false })
    async findAll(@Query() query: FindAllCardsQuery): Promise<Card[]> {
        return this.cardService.findAll(query);
    }
}
