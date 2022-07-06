import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";
import { Item } from './item.schema';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Order {

    
    @Prop({
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    })
    userId: string;
    
    @Prop()
    items: Item[];

    @Prop({
        required: true
    })
    amount: number;

    @Prop({
        required: true
    })
    address: string;

    @Prop({
        required: true
    })
    phone: string

    @Prop({
        default: 'Not processed',
        enum: [
            "Not processed",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled",
          ],
    })
    status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);