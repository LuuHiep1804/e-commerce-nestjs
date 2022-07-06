import { Item } from "src/models/item.schema";

export class OrderDTO {
    items: Item[];
    userId: string;
    amount: number;
    address: string;
    phone: string;
    status: string;
}