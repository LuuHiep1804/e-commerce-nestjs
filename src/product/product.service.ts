import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/types/product';
import { FilterProductDTO } from './filter-product.dto';
import { CreateProductDTO } from './product.dto';

@Injectable()
export class ProductService {
    constructor(@InjectModel('Product') private readonly productModel: Model<Product>) {}

    async getFilteredProducts(filterProductDTO: FilterProductDTO): Promise<Product[]> {
        const {category, search, price} = filterProductDTO;
        let categoryQuery = {};
        let priceQuery = {};
        let searchQuery = {};
        //category
        if(category) {
            categoryQuery = {category: {_id: category}};
        }
        //price
        if(price) {
            priceQuery = {price: {$lte: price}};
        }
        //search by name and description
        if(search) {
            searchQuery = {$or: [{name: new RegExp(search)}, {description: new RegExp(search)}]}
        }
        const queries = {...categoryQuery, ...priceQuery, ...searchQuery};
        const products = await this.productModel
            .find(queries)
            .populate('category')
            .sort({price: -1});
        return products;
    }

    async findAllProducts(): Promise<Product[]> {
        return await this.productModel.find().populate('category');
    }

    async findById(id: string): Promise<Product> {
        const product = await this.productModel.findById(id).populate('category');
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
