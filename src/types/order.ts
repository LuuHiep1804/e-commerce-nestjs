import { Document } from "mongoose";
import { Item } from "src/models/item.schema";

export interface Order extends Document {
    items: Item[];
    userId: string;
    amount: number;
    address: string;
    phone: string;
    status: string;
}