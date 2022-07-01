import { Prop, Schema } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";
import { Item } from './item.schema';

@Schema()
export class Order {

    @Prop()
    items: Item[];

    @Prop({
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    })
    userId: string;

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