import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Deck } from './schemas/deck.schema';
import { Model } from 'mongoose';
import { CreateDeckDTO } from './dto/create-deck.dto';
import { UpdateDeckDTO } from './dto/update-deck.dto';

@Injectable()
export class DeckService {
    constructor(
        @InjectModel(Deck.name)
        private readonly deckModel: Model<Deck>,
    ) { }

    async create(createDeckDto: CreateDeckDTO): Promise<Deck> {
        const newDeck = new this.deckModel(createDeckDto);
        return newDeck.save();
    }

    async findById(id: string): Promise<Deck> {
        const deck = await this.deckModel.findById(id).exec();
        if (!deck) {
            throw new NotFoundException(`Deck with ID ${id} not found`);
        }
        return deck;
    }

    async getByUserId(userId: string): Promise<Deck[]> {
        return this.deckModel.find({ user_id: userId }).exec();
    }

    async update(id: string, updateDeckDto: UpdateDeckDTO): Promise<Deck> {
        const updatedDeck = await this.deckModel.findByIdAndUpdate(id, updateDeckDto, { new: true }).exec();
        if (!updatedDeck) {
            throw new NotFoundException(`Deck with ID ${id} not found`);
        }
        return updatedDeck;
    }

    async delete(id: string): Promise<void> {
        const result = await this.deckModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Deck with ID ${id} not found`);
        }
    }
}
