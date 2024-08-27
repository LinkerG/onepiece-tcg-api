import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CardService } from './card.service';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
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

    @Get(":card_id")
    @ApiParam({ name: 'card_id', description: 'ID of the card', type: String })
    @ApiOperation({ description: 'Get card by card_id' })
    async findById(@Param('card_id') card_id: string): Promise<Card> {
        return this.cardService.findById(card_id);
    }

    @Patch(":card_id/addAlteredArt")
    @ApiParam({ name: 'card_id', description: 'ID of the card', type: String })
    @ApiOperation({ description: 'Increases alternate art counter for card' })
    async addAlternateArt(@Param('card_id') card_id: string): Promise<Card> {
        return this.cardService.addAlternateArt(card_id);
    }

    @Patch(":card_id/removeAlteredArt")
    @ApiParam({ name: 'card_id', description: 'ID of the card', type: String })
    @ApiOperation({ description: 'Decreases alternate art counter for card' })
    async removeAlternateArt(@Param('card_id') card_id: string): Promise<Card> {
        return this.cardService.removeAlternateArt(card_id);
    }

    @Post()
    @ApiOperation({ description: 'Create a new card' })
    async create(@Body() card: CreateCardDto): Promise<Card> {
        return this.cardService.create(card);
    }
}
