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
            const uniqueData = Array.from(new Map(data.map(card => [card.card_id, card])).values());

            const existingCards = await this.cardModel.find(
                { card_id: { $in: uniqueData.map(card => card.card_id) } },
                { card_id: 1 }
            ).lean();

            const existingCardIds = new Set(existingCards.map(card => card.card_id));

            const newCards = uniqueData.filter(card => !existingCardIds.has(card.card_id));

            if (newCards.length > 0) {
                await this.cardModel.insertMany(newCards.map(cardData => ({
                    card_id: cardData.card_id,
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
                })));

                console.log(`${newCards.length} cards inserted successfully.`);
            } else {
                console.log('No new cards to insert.');
            }
        } else {
            console.error('Invalid data format. Expected an array of cards.');
        }
    }
}
