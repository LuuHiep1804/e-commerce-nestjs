import { Document } from "mongoose";

export interface Product extends Document {
    name: string;
    description: string;
    price: number;
    quantityInStock: number;
    image: string;
    title: string;
    category: string;
}