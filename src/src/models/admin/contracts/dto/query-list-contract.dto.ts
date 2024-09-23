import { IsOptional, IsString, IsDate, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from 'src/models/dto/pagination.dto';

export class ContractListQueryDto extends PaginationDto {
  @ApiProperty({
    example: 'search term',
    description: 'Search term for filtering contracts',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    example: 'RIBPAY',
    description: 'Filter by contract type',
    required: false,
  })
  @IsOptional()
  @IsString()
  contract_type?: string;

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

  @ApiProperty({
    example: '2024-06-20',
    description: 'Filter by deletion',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  is_deleted?: boolean;
}
