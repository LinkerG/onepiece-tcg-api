import { Rarity, CardType, CardColor, CardAttribute } from '../schemas/card.schema';

export class CreateCardDto {

    card_id: string;

    name: string;

    rarity: Rarity;

    type: CardType;

    attribute: CardAttribute[];

    power: string;

    counter: string;

    color: CardColor[];

    card_type: string[];

    effect: string;

    image_url: string;

    alternate_art: boolean;

    series_id: number;
}
