import { Document } from "mongoose";
import { Item } from "src/models/item.schema";

export interface Cart extends Document {
    userId: string;
    items: Item[];
    totalPrice: number;
}