import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model as MongooseModel } from 'mongoose';
import { Card } from './schemas/card.schema';
import { FindAllCardsQuery } from './dto/find-card.dto';
import * as puppeteer from 'puppeteer';
import { log } from 'console';

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

        // Encuentra las cartas con los filtros aplicados
        const cards = await this.cardModel.find(query).sort({ card_id: 1 }).exec();

        if (!cards || cards.length === 0) {
            throw new NotFoundException('No cards found');
        }

        // Ordena las cartas alfabéticamente y luego numéricamente por card_id
        return cards.sort((a, b) => {
            const [prefixA, numA] = a.card_id.split('-');
            const [prefixB, numB] = b.card_id.split('-');

            if (prefixA === prefixB) {
                return parseInt(numA, 10) - parseInt(numB, 10);
            } else {
                return prefixA.localeCompare(prefixB);
            }
        });
    }

    async findById(id: string): Promise<Card> {
        const card = await this.cardModel.findOne({ card_id: id }).exec();

        if (!card)
            throw new NotFoundException(`Card with card_id ${id} not found.`);
        return card;
    }

    async getPrice(card_id: string) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const url = card_id.startsWith('P') ?
            `https://www.cardmarket.com/en/OnePiece/Products/Search?idExpansion=5230&searchString=${card_id}` :
            `https://www.cardmarket.com/en/OnePiece/Products/Search?searchString=${card_id}`

        // Navegar a la URL
        await page.goto(url);

        // Esperar que el contenido se cargue y obtener el HTML
        const content = await page.content();
        try {
            const data = await page.evaluate(() => {
                // Extraer datos del DOM directamente usando JS
                return document.querySelector('.col-price')?.textContent;
            });
            return data;
        } catch (err) {
            console.log(err);
        }

        // Cerrar el navegador
        await browser.close();

        // Devolver los datos extraídos
        throw NotFoundException;
    }

    async getCollections(): Promise<string[]> {
        const collections = await this.cardModel.aggregate([
            {
                $project: {
                    collection: { $arrayElemAt: [{ $split: ["$card_id", "-"] }, 0] }
                }
            },
            {
                $group: {
                    _id: null,
                    collections: { $addToSet: "$collection" }
                }
            },
            {
                $project: {
                    _id: 0,
                    collections: 1
                }
            },
            {
                $unwind: "$collections" // Descompone el array para aplicar la ordenación
            },
            {
                $sort: { "collections": 1 } // Ordena alfabéticamente
            },
            {
                $group: {
                    _id: null,
                    collections: { $push: "$collections" } // Vuelve a agrupar en un array
                }
            }
        ]);

        if (collections.length === 0) {
            throw new NotFoundException('No collections found');
        }

        return collections[0].collections;
    }

    async addAlternateArt(card_id: string): Promise<Card> {
        const card = await this.cardModel.findOne({ card_id }).exec();

        if (!card)
            throw new NotFoundException(
                `Card with card_id ${card_id} not found.`,
            );

        card.alternate_art++;
        return card.save();
    }

    async removeAlternateArt(card_id: string): Promise<Card> {
        const card = await this.cardModel.findOne({ card_id }).exec();

        if (!card)
            throw new NotFoundException(
                `Card with card_id ${card_id} not found.`,
            );

        card.alternate_art--;
        return card.save();
    }

    async create(card: Card): Promise<Card> {
        const existingCard = await this.cardModel.findOne({
            card_id: card.card_id,
        });

        if (existingCard)
            throw new BadRequestException(
                `A card with card_id ${card.card_id} already exists. ${existingCard.name}. If you want to add an altered art, please use /card/:card_id/addAlteredArt endpoint.`,
            );

        const createdCard = new this.cardModel(card);
        return createdCard.save();
    }
}
