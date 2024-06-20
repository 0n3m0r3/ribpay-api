import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  per_page?: number;
}
