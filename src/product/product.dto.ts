import { Category } from "src/types/category";

export class CreateProductDTO {
    name: string;
    description: string;
    price: number;
    quantityInStock: number;
    image: string;
    title: string;
    category: Category;
}