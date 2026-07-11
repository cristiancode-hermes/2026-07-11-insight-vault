import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { InsightsService } from './insights.service';
import { CreateInsightDto } from './dto/create-insight.dto';
import { UpdateInsightDto } from './dto/update-insight.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Insights')
@Controller('insights')
@UseGuards(JwtAuthGuard)
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Post()
  async create(@Body() dto: CreateInsightDto, @Request() req) {
    return this.insightsService.create(dto, req.user.id);
  }

  @Get()
  async findAll(@Request() req, @Query('search') search?: string) {
    return this.insightsService.findAll(req.user.id, search);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.insightsService.findOne(+id, req.user.id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateInsightDto, @Request() req) {
    return this.insightsService.update(+id, dto, req.user.id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.insightsService.remove(+id, req.user.id);
  }
}
