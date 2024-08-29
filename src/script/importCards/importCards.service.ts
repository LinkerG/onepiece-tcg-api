import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Card } from '../../card/schemas/card.schema';
import * as fs from 'fs';
import * as path from 'path';
import { Model as MongooseModel } from 'mongoose';

@Injectable()
export class ImportCardsService {
    constructor(
        @InjectModel(Card.name) private cardModel: MongooseModel<Card>,
    ) { }

    async insertFromFile(filePath: string): Promise<void> {
        console.time('Execution Time'); // Inicia el cronómetro

        try {
            const fullPath = path.resolve(filePath);

            // Verifica si el archivo existe
            if (!fs.existsSync(fullPath)) {
                console.error('Error: File not found at', fullPath);
                console.log('0 cards inserted.');
                console.timeEnd('Execution Time'); // Finaliza y muestra el tiempo
                return;
            }

            // Intenta leer el archivo y parsear el JSON
            let data: any;
            try {
                const fileContent = fs.readFileSync(fullPath, 'utf-8');
                data = JSON.parse(fileContent);
            } catch (error) {
                console.error(
                    'Error: Unable to read or parse JSON file.',
                    error.message,
                );
                console.log('0 cards inserted.');
                console.timeEnd('Execution Time'); // Finaliza y muestra el tiempo
                return;
            }

            // Verifica que los datos sean un array
            if (!Array.isArray(data)) {
                console.error(
                    'Error: Expected an array of cards in JSON file.',
                );
                console.log('0 cards inserted.');
                console.timeEnd('Execution Time'); // Finaliza y muestra el tiempo
                return;
            }

            // Manejando duplicados en el JSON
            const cardMap = new Map<string, any>();

            data.forEach((cardData) => {
                if (cardMap.has(cardData.card_id)) {
                    // Si la carta ya existe en el Map, incrementa `alternate_art`
                    cardMap.get(cardData.card_id).alternate_art += 1;
                } else {
                    // Si la carta no existe en el Map, la añade con `alternate_art` inicializado a 0
                    cardMap.set(cardData.card_id, {
                        card_id: cardData.card_id,
                        name: cardData.name,
                        rarity: cardData.rarity,
                        type: cardData.type,
                        attribute: cardData.attribute.split('/'),
                        power:
                            cardData.power === '-'
                                ? 0
                                : parseInt(cardData.power),
                        counter:
                            cardData.counter === '-'
                                ? 0
                                : parseInt(cardData.counter),
                        color: cardData.color.split('/'),
                        card_type: cardData.card_type.split('/'),
                        effect: cardData.effect,
                        alternate_art: 0, // Inicia en 0 y se incrementa por cada duplicado en el JSON
                    });
                }
            });

            // Obtiene todos los `card_id` existentes en la base de datos
            const existingCards = await this.cardModel
                .find(
                    { card_id: { $in: Array.from(cardMap.keys()) } },
                    { card_id: 1 },
                )
                .lean();

            const existingCardIds = new Set(
                existingCards.map((card) => card.card_id),
            );

            // Filtra las cartas que no existen en la base de datos
            const newCards = Array.from(cardMap.values()).filter(
                (card) => !existingCardIds.has(card.card_id),
            );

            if (newCards.length > 0) {
                // Inserta todas las nuevas cartas en la base de datos
                await this.cardModel.insertMany(newCards);
                console.log(
                    `${newCards.length} unique cards inserted successfully.`,
                );
            } else {
                console.log('No new cards to insert.');
            }
        } catch (error) {
            console.error('Unexpected error:', error.message);
        } finally {
            console.timeEnd('Execution Time'); // Finaliza y muestra el tiempo
        }
    }
}
