import { Document } from "mongoose";

export interface Payment extends Document {
    orderId: string;
    userId: string;
    amount: number;
    status: string;
}