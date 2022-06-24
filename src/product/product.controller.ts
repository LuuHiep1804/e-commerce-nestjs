import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { FilterProductDTO } from './filter-product.dto';
import { CreateProductDTO } from './product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) {}

    @Get('/')
    async getProducts(@Query() filterProductDTO: FilterProductDTO) {
        if(Object.keys(filterProductDTO).length) {
            const filteredProducts = await this.productService.getFilteredProducts(filterProductDTO);
            return filteredProducts;
        }else {
            const products = await this.productService.findAllProducts();
            return products;
        }
    }

    @Get('/:id')
    async getProduct(@Param('id') id: string) {
        const product = await this.productService.findById(id);
        return product;
    }

    @Post('/')
    async create(@Body() createProductDTO: CreateProductDTO) {
        const product = await this.productService.create(createProductDTO);
        return product;
    }

    @Put('/:id')
    async update(@Param('id') id: string, @Body() createProductDTO: CreateProductDTO) {
        const product = await this.productService.update(id, createProductDTO);
        return product;
    }

    @Delete('/:id')
    async delete(@Param('id') id: string) {
        const product = await this.productService.delete(id);
        return product;
    }

}
