import { Document } from "mongoose";

export interface Item extends Document {
    ProductId: string;
    name: string;
    quantity: number;
    price: number;
    subTotalPrice: number;
}