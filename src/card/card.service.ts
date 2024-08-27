import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Card, CardAttribute, CardColor, parseArrayValues } from './schemas/card.schema';
import { CreateCardDto } from './dto/create-card.dto';
import { Model as MongooseModel } from 'mongoose';

@Injectable()
export class CardService {
    constructor(
        @InjectModel(Card.name)
        private cardModel: MongooseModel<Card>,
    ) { }

    async findAll(): Promise<Card[]> {
        const cards = await this.cardModel.find();

        if (!cards) throw new NotFoundException("No cards found");
        else return cards;
    }
}
