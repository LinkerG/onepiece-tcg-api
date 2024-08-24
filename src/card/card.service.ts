import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Card, CardAttribute, CardColor, parseArrayValues } from './schemas/card.schema';
import { CreateCardDto } from './dto/create-card.dto';
import * as mongoose from 'mongoose';

@Injectable()
export class CardService {
    constructor(
        @InjectModel(Card.name)
        private cardModel: mongoose.Model<Card>,
    ) { }

    async findAll(): Promise<Card[]> {
        const cards = await this.cardModel.find();

        if (!cards) throw new NotFoundException("No cards found");
        else return cards;
    }

    async createCards(data: any): Promise<Card[]> {
        const createdCards: Card[] = []
        data.map(card => {
            const cardDto = new CreateCardDto();
            cardDto.card_id = card._id;
            cardDto.name = card.name;
            cardDto.rarity = card.rarity;
            cardDto.type = card.type;
            cardDto.attribute = parseArrayValues(CardAttribute, card.attribute);
            cardDto.power = card.power;
            cardDto.counter = card.counter;
            cardDto.color = parseArrayValues(CardColor, card.color);
            cardDto.card_type = card.card_type.split('/');
            cardDto.effect = card.effect;
            cardDto.image_url = card.image_url;
            cardDto.alternate_art = card.alternate_art;
            cardDto.series_id = card.series_id;

            const createdCard = new this.cardModel(cardDto);
            createdCard.save()
            createdCards.push(createdCard);
        })

        return createdCards;
    }
}
