import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})
export class User {
    @Prop({
        unique: true
    })
    username: string;

    @Prop()
    password: string;

    @Prop({
        unique: true
    })
    email: string;

    @Prop({
        unique: true
    })
    phone: string;

    @Prop()
    address: string;

    // @Prop()
    // roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);