import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";

@Schema({ timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}})
export class Payment {
    @Prop({
        type: SchemaTypes.ObjectId,
        ref: 'Order'
    })
    orderId: string;

    @Prop({
        type: SchemaTypes.ObjectId,
        ref: 'User'
    })
    userId: string;

    @Prop()
    amount: number;

    @Prop({
        default: 'Unpaid',
        enum: [
            'Unpaid',
            'Paid',
            'Cancelled'
        ]
    })
    status: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);