import { Category } from "src/types/category";

export class FilterProductDTO {
    search: string;
    category: string;
    price: number;
    featured: boolean;
}