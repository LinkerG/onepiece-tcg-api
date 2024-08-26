import { Body, Controller, Get, Post } from '@nestjs/common';
import { CardService } from './card.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('card')
@ApiTags('cards')
export class CardController {
    constructor(private readonly cardService: CardService) { }

    @Get()
    @ApiOperation({ summary: 'Get all cards' })
    async findAll() {
        console.log('[GET] /card')
        return this.cardService.findAll();
    }
}
