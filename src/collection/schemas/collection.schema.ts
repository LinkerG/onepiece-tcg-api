import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export interface UserHasCard {
    card_id: string;
    quantity: number;
}

@Schema({ timestamps: true })
export class Collection {
    @Prop({ unique: true })
    user_id: string;

    @Prop({ type: [{ card_id: String, quantity: Number }] })
    user_collection: UserHasCard[];
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);