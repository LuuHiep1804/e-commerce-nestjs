import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/models/product.schema';
import { CreateProductDTO } from './product.dto';

@Injectable()
export class ProductService {
    constructor(@InjectModel('Product') private readonly productModel: Model<ProductDocument>) {}

    async findAllProducts(): Promise<Product[]> {
        return await this.productModel.find().exec();
    }

    async findById(id: string): Promise<Product> {
        const product = await this.productModel.findById(id);
        if(!product) {
            throw new HttpException('Product not found', HttpStatus.BAD_REQUEST);
        }
        return product;
    }

    async create(productDTO: CreateProductDTO): Promise<Product> {
        const product = await this.productModel.create({
            ...productDTO
        });
        await product.save();
        return product;
    }

    async update(id: string, productDTO: CreateProductDTO): Promise<Product> {
        const updateProduct = await this.productModel.findByIdAndUpdate(id, productDTO, {new: true});
        if(!updateProduct) {
            throw new HttpException('Product not found', HttpStatus.BAD_REQUEST);
        }
        return updateProduct;
    }

    async delete(id: string): Promise<any> {
        const deleteProduct = await this.productModel.findByIdAndRemove(id);
        if(!deleteProduct) {
            throw new HttpException('Product not found', HttpStatus.BAD_REQUEST);
        }
        return deleteProduct;
    }

}
