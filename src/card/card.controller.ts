import { Body, Controller, Post } from '@nestjs/common';
import { CardService } from './card.service';

@Controller('card')
export class CardController {
    constructor(private readonly cardService: CardService) { }

    @Post("byJson")
    async createByJson(@Body() cardData: any[]) {
        return this.cardService.createCards(cardData);
    }
}
