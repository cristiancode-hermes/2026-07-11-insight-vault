import { IsString, IsOptional, IsNumber, MinLength } from 'class-validator';

export class CreateInsightDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(10)
  content: string;

  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @IsString()
  @IsOptional()
  tags?: string;
}
