import { IsOptional, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from 'src/models/dto/pagination.dto'; 

export class TerminalListQueryDto extends PaginationDto {
  @ApiProperty({
    example: 'search term',
    description: 'Search term for filtering terminals',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    example: 'ribpay_classic',
    description: 'Filter by terminal subscription type',
    required: false,
  })
  @IsOptional()
  @IsString()
  terminal_subscription_type?: string;

  @ApiProperty({
    example: '2024-06-20',
    description: 'Filter by creation date before',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  created_before?: Date;

  @ApiProperty({
    example: '2024-06-20',
    description: 'Filter by creation date after',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  created_after?: Date;

  @ApiProperty({
    example: '2024-06-20',
    description: 'Filter by last modified date before',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  last_modified_before?: Date;

  @ApiProperty({
    example: '2024-06-20',
    description: 'Filter by last modified date after',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  last_modified_after?: Date;
}
