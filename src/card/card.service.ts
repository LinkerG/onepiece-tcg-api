import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model as MongooseModel } from 'mongoose';
import { Card } from './schemas/card.schema';
import { FindAllCardsQuery } from './dto/find-card.dto';

@Injectable()
export class CardService {
    constructor(
        @InjectModel(Card.name)
        private cardModel: MongooseModel<Card>,
    ) { }

    async find(filters: FindAllCardsQuery): Promise<Card[]> {
        const query: any = {}; // Utilizamos `any` aquí para construir la consulta dinámica

        if (filters.card_id) {
            query.card_id = { $regex: filters.card_id, $options: 'i' };
        }
        if (filters.name) {
            query.name = { $regex: filters.name, $options: 'i' };
        }
        if (filters.rarity) {
            query.rarity = filters.rarity;
        }
        if (filters.type) {
            query.type = filters.type;
        }
        if (filters.attribute && filters.attribute.length > 0) {
            query.attribute = { $in: filters.attribute };
        }
        if (filters.color && filters.color.length > 0) {
            query.color = { $in: filters.color };
        }
        if (filters.card_type && filters.card_type.length > 0) {
            query.card_type = { $in: filters.card_type };
        }

        const cards = await this.cardModel.find(query);

        if (!cards || cards.length === 0) {
            throw new NotFoundException("No cards found");
        }

        return cards;
    }

    async create(card: Card): Promise<Card> {
        const newCard = new this.cardModel(card);
        return await newCard.save();
    }
}
