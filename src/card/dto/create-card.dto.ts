import { Rarity, CardType, CardColor, CardAttribute } from '../schemas/card.schema';

export class CreateCardDto {

    card_id: string;

    name: string;

    rarity: Rarity;

    type: CardType;

    attribute: CardAttribute[];

    power: number;

    counter: number;

    color: CardColor[];

    card_type: string[];

    effect: string;

    alternate_art: number;
}
