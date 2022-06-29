import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";
import { Item } from "./item.schema";

@Schema()
export class Cart {
    @Prop({
        type: SchemaTypes.ObjectId,
        ref: 'User'
    })
    userId: string;

    @Prop()
    items: Item[];

    @Prop()
    totalPrice: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);