import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

    async findById(id: string): Promise<Card> {
        const card = await this.cardModel.findOne({ card_id: id }).exec();

        if (!card) throw new NotFoundException(`Card with card_id ${id} not found.`);
        return card;
    }

    async addAlternateArt(card_id: string): Promise<Card> {
        const card = await this.cardModel.findOne({ card_id }).exec();

        if (!card) throw new NotFoundException(`Card with card_id ${card_id} not found.`);

        card.alternate_art++;
        return card.save();
    }

    async removeAlternateArt(card_id: string): Promise<Card> {
        const card = await this.cardModel.findOne({ card_id }).exec();

        if (!card) throw new NotFoundException(`Card with card_id ${card_id} not found.`);

        card.alternate_art--;
        return card.save();
    }

    async create(card: Card): Promise<Card> {
        const existingCard = await this.cardModel.findOne({ card_id: card.card_id });

        if (existingCard) throw new BadRequestException(`A card with card_id ${card.card_id} already exists. ${existingCard.name}. If you want to add an altered art, please use /card/:card_id/addAlteredArt endpoint.`);

        const createdCard = new this.cardModel(card);
        return createdCard.save();
    }
}
