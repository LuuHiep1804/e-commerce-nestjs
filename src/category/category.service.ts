import { HttpException, HttpStatus, Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Category } from 'src/types/category';
import { CategoryDTO } from './category.dto';

@Injectable()
export class CategoryService {
    constructor(@InjectModel('Category') private readonly categoryModel: Model<Category>) {}
    
    async findAll(): Promise<Category[]> {
        return await this.categoryModel.find();
    }

    async findOne(id: string): Promise<Category> {
        return await this.categoryModel.findById(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async create(categoryDTO: CategoryDTO): Promise<Category> {
        const createdCategory = await this.categoryModel.create({
            ...categoryDTO
        });
        await createdCategory.save();
        return createdCategory;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async update(id: string, categoryDTO: CategoryDTO): Promise<Category> {
        const updateCategory = await this.categoryModel.findByIdAndUpdate(id, categoryDTO, {new: true});
        if(!updateCategory) {
            throw new HttpException('Category not found', HttpStatus.BAD_REQUEST);
        }
        return updateCategory;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async delete(id: string): Promise<any> {
        const deleteCategory = await this.categoryModel.findByIdAndDelete(id);
        if(!deleteCategory) {
            throw new HttpException('Category not found', HttpStatus.BAD_REQUEST);
        }
        return deleteCategory;
    }

}
