import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Category } from 'src/models/category.schema';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Product {
    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    price: number;

    @Prop()
    quantityInStock: number;

    @Prop()
    image: string;

    @Prop()
    title: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        index: true
    })
    category: Category;

    @Prop({
        default: false
    })
    featured: boolean;

}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.pre(/^find/, async function (next: Function) {
    this.populate({
        path: 'category',
        select: 'name'
    })
    next();
})