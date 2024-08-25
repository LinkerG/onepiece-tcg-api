import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Card } from '../card/schemas/card.schema';
import * as fs from 'fs';
import * as path from 'path';
import * as mongoose from 'mongoose';

@Injectable()
export class ScriptsService {
    constructor(@InjectModel(Card.name) private cardModel: mongoose.Model<Card>) { }

    async insertFromFile(filePath: string): Promise<void> {
        const fullPath = path.resolve(filePath);
        const data = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));

        if (Array.isArray(data)) {
            const cards = data.map(cardData => {
                return new this.cardModel({
                    card_id: cardData._id,
                    name: cardData.name,
                    rarity: cardData.rarity,
                    type: cardData.type,
                    attribute: cardData.attribute.split('/'),
                    power: cardData.power,
                    counter: cardData.counter,
                    color: cardData.color.split('/'),
                    card_type: cardData.card_type.split('/'),
                    effect: cardData.effect,
                    image_url: cardData.image_url,
                    alternate_art: cardData.alternate_art,
                    series_id: cardData.series_id,
                });
            });

            await this.cardModel.insertMany(cards);
            console.log(`${cards.length} cards inserted successfully.`);
        } else {
            console.error('Invalid data format. Expected an array of cards.');
        }
    }
}
