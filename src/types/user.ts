import { Document } from "mongoose";

export interface User extends Document {
    username: string;
    password: string;
    email: string;
    phone: string;
    address: string;
    roles: string[];
}