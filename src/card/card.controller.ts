import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CardService } from './card.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Card, CardAttribute, CardColor, CardType, Rarity } from './schemas/card.schema';
import { FindAllCardsQuery } from './dto/find-card.dto';
import { CreateCardDto } from './dto/create-card.dto';

@Controller('card')
@ApiTags('Card')
export class CardController {
    constructor(private readonly cardService: CardService) { }

    @Get()
    @ApiOperation({ description: 'Get cards matching parameters' })
    async findAll(@Query() query: FindAllCardsQuery): Promise<Card[]> {
        return this.cardService.find(query);
    }

    @Post()
    @ApiOperation({ description: 'Create a new card' })
    async create(@Body() card: CreateCardDto): Promise<Card> {
        return this.cardService.create(card);
    }
}
