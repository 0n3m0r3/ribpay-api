import { IsOptional, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from 'src/models/dto/pagination.dto'; // Adjust the import path as needed

export class UserListQueryDto extends PaginationDto {
  @ApiProperty({
    example: 'search term',
    description: 'Search term for filtering users',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    example: '2023-01-01',
    description: 'Filter by last modified date before',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  last_modified_before?: Date;

  @ApiProperty({
    example: '2023-01-01',
    description: 'Filter by last modified date after',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  last_modified_after?: Date;
}
