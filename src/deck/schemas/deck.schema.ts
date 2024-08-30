import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

export class Card {
    @Prop({ required: true })
    card_id: string;

    @Prop({ required: true })
    quantity: number;
}

export class UserDeck {
    @Prop({ required: true })
    deck_name: string;

    @Prop({ required: true })
    leader: string;

    @Prop({ type: [Card], required: true })
    @Type(() => Card)
    @ValidateNested({ each: true })
    @IsArray()
    deck_cards: Card[];
}

@Schema({ timestamps: true })
export class Deck extends Document {
    @Prop({ required: true })
    user_id: string;

    @Prop({ type: UserDeck, required: true })
    @Type(() => UserDeck)
    @ValidateNested()
    deck: UserDeck;
}

export const DeckSchema = SchemaFactory.createForClass(Deck);
