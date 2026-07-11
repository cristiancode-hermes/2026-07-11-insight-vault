import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Insight } from './entities/insight.entity';
import { CreateInsightDto } from './dto/create-insight.dto';
import { UpdateInsightDto } from './dto/update-insight.dto';

@Injectable()
export class InsightsService {
  constructor(
    @InjectRepository(Insight)
    private readonly insightRepository: Repository<Insight>,
  ) {}

  async create(dto: CreateInsightDto, userId: number) {
    const insight = new Insight();
    insight.title = dto.title;
    insight.content = dto.content;
    insight.categoryId = dto.categoryId ?? null;
    insight.tags = dto.tags ?? null;
    insight.userId = userId;
    return this.insightRepository.save(insight);
  }

  async findAll(userId: number, search?: string) {
    const where: any = { userId };

    if (search) {
      where.title = Like(`%${search}%`);
      // For OR conditions we need to use FindOptionsWhere with OR
      return this.insightRepository.find({
        where: [
          { userId, title: Like(`%${search}%`) },
          { userId, content: Like(`%${search}%`) },
        ],
        order: { createdAt: 'DESC' },
      });
    }

    return this.insightRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number) {
    const insight = await this.insightRepository.findOne({ where: { id, userId } });
    if (!insight) {
      throw new NotFoundException('Insight not found');
    }
    return insight;
  }

  async update(id: number, dto: UpdateInsightDto, userId: number) {
    const insight = await this.findOne(id, userId);
    Object.assign(insight, dto);
    return this.insightRepository.save(insight);
  }

  async remove(id: number, userId: number) {
    const insight = await this.findOne(id, userId);
    return this.insightRepository.remove(insight);
  }
}
