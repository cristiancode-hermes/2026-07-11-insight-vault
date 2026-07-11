import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto, userId: number) {
    return this.categoryRepository.save({
      name: dto.name,
      description: dto.description,
      userId,
    });
  }

  async findAll(userId: number) {
    return this.categoryRepository.find({ where: { userId } });
  }

  async findOne(id: number, userId: number) {
    const category = await this.categoryRepository.findOne({ where: { id, userId } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async update(id: number, dto: UpdateCategoryDto, userId: number) {
    const category = await this.findOne(id, userId);
    Object.assign(category, dto);
    return this.categoryRepository.save(category);
  }

  async remove(id: number, userId: number) {
    const category = await this.findOne(id, userId);
    return this.categoryRepository.remove(category);
  }
}
