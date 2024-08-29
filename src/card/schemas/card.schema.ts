import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum Rarity {
    COMMON = 'C',
    UNCOMMON = 'UC',
    RARE = 'R',
    SUPER_RARE = 'SR',
    LEADER = 'L',
}

export enum CardType {
    CHARACTER = 'CHARACTER',
    LEADER = 'LEADER',
    EVENT = 'EVENT',
    STAGE = 'STAGE',
}

export enum CardColor {
    RED = 'Red',
    GREEN = 'Green',
    BLUE = 'Blue',
    YELLOW = 'Yellow',
    BLACK = 'Black',
    PURPLE = 'Purple',
}

export enum CardAttribute {
    SLASH = 'Slash',
    RANGED = 'Ranged',
    STRIKE = 'Strike',
    SPECIAL = 'Special',
    WISDOM = 'Wisdom',
    NONE = '',
}

export function parseArrayValues(enumType: any, value: string) {
    return value.split('/').map((v) => enumType[v.trim()]);
}

@Schema({ timestamps: true })
export class Card {
    @Prop({ unique: true })
    card_id: string;

    @Prop()
    name: string;

    @Prop()
    rarity: Rarity;

    @Prop()
    type: CardType;

    @Prop()
    attribute: CardAttribute[];

    @Prop()
    power: number;

    @Prop()
    counter: number;

    @Prop()
    color: CardColor[];

    @Prop()
    card_type: string[];

    @Prop()
    effect: string;

    @Prop()
    alternate_art: number;
}

export const CardSchema = SchemaFactory.createForClass(Card);
