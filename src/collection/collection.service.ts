import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Collection } from './schemas/collection.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class CollectionService {
    constructor(
        @InjectModel(Collection.name) private readonly collectionModel: Model<Collection>,
    ) { }

    async createEmptyCollection(userId: ObjectId): Promise<Collection> {
        // Verificar si ya existe una colección para el usuario
        const existingCollection = await this.collectionModel.findOne({ user_id: userId });
        if (existingCollection)
            throw new NotFoundException(`Collection already exists for user ${userId}`);

        const newCollection = new this.collectionModel({
            user_id: userId,
            user_collection: [], // Colección vacía
        });

        return newCollection.save();
    }
}
