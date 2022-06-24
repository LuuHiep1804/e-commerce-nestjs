import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { CategoryDTO } from './category.dto';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    @Get('/')
    async findAll() {
        return await this.categoryService.findAll();
    }

    @Get('/:id')
    async findOne(@Param('id') id: string) {
        return await this.categoryService.findOne(id);
    }

    @Post('/')
    async create(@Body() categoryDTO: CategoryDTO) {
        const category = await this.categoryService.create(categoryDTO);
        return category;
    }

    @Put('/:id')
    async update(@Param('id') id: string, @Body() categoryDTO: CategoryDTO) {
        const category = await this.categoryService.update(id, categoryDTO);
        return category;
    }

    @Delete('/:id')
    async delete(@Param('id') id: string) {
        const category = await this.categoryService.delete(id);
        return category;
    }
}
