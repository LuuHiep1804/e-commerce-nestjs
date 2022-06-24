import { Document } from "mongoose";
import { Category } from "./category";

export interface Product extends Document {
    name: string;
    description: string;
    price: number;
    quantityInStock: number;
    image: string;
    title: string;
    category: Category;
}