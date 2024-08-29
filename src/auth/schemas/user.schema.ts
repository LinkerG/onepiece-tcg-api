import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum Role {
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    USER = 'USER',
}

@Schema({ timestamps: true })
export class User {
    @Prop()
    name: string;

    @Prop()
    role: Role;

    @Prop({ unique: [true, 'Email already in use'] })
    email: string;

    @Prop()
    password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
