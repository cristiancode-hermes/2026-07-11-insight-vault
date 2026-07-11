import { IsString, IsOptional, IsNumber, MinLength } from 'class-validator';

export class UpdateInsightDto {
  @IsString()
  @MinLength(3)
  @IsOptional()
  title?: string;

  @IsString()
  @MinLength(10)
  @IsOptional()
  content?: string;

  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @IsString()
  @IsOptional()
  tags?: string;
}
