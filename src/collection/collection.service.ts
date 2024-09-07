import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Collection, UserHasCard } from './schemas/collection.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { UserHasCardDTO } from './dto/user-has-card.dto';

@Injectable()
export class CollectionService {
    constructor(
        @InjectModel(Collection.name)
        private readonly collectionModel: Model<Collection>,
    ) { }

    async createEmptyCollection(userId: ObjectId): Promise<Collection> {
        // Verificar si ya existe una colección para el usuario
        const existingCollection = await this.collectionModel.findOne({
            user_id: userId,
        });
        if (existingCollection)
            throw new NotFoundException(
                `Collection already exists for user ${userId}`,
            );

        const newCollection = new this.collectionModel({
            user_id: userId,
            user_collection: [], // Colección vacía
        });

        return newCollection.save();
    }

    async getCollections(): Promise<Collection[]> {
        const collections = await this.collectionModel.find().exec();
        if (!collections || collections.length === 0)
            throw new NotFoundException('No collections found');
        return collections;
    }

    async getUserCollection(userId): Promise<Collection> {
        const collection = await this.collectionModel
            .findOne({ user_id: userId })
            .exec();
        if (!collection)
            throw new NotFoundException(
                'No collection found for user ${userId}',
            );
        return collection;
    }

    async saveCardToUserCollection(userId: string, cardToAdd: UserHasCardDTO): Promise<Collection> {
        const collection = await this.collectionModel
            .findOne({ user_id: userId })
            .exec();

        if (!collection) {
            throw new NotFoundException(`No collection found for user ${userId}`);
        }

        if (cardToAdd.quantity === 0) {
            // Eliminar la carta de la colección si la cantidad es 0
            collection.user_collection = collection.user_collection.filter(
                (card) => card.card_id.toString() !== cardToAdd.card_id.toString(),
            );
        } else {
            // Buscar si la carta ya está en la colección del usuario
            const existingCard = collection.user_collection.find(
                (card) => card.card_id.toString() === cardToAdd.card_id.toString(),
            );

            if (existingCard) {
                existingCard.quantity = cardToAdd.quantity;
            } else {
                collection.user_collection.push(cardToAdd);
            }
        }

        await collection.save();

        return collection;
    }

}
