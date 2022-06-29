import { Document } from "mongoose";

export interface Item extends Document {
    productId: string;
    name: string;
    quantity: number;
    price: number;
}