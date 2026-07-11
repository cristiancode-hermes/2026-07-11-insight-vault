import { IsString, MinLength, IsOptional } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @MinLength(2)
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
