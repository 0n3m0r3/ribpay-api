import { IsOptional, IsString, IsDate, IsBoolean, IsInt } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from 'src/models/dto/pagination.dto'; 

export class TransactionListQueryDto extends PaginationDto {
  @ApiProperty({
    example: 'search term',
    description: 'Search term for filtering transactions',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    example: 'completed',
    description: 'Filter by transaction status',
    required: false,
  })
  @IsOptional()
  @IsString()
  transaction_status?: string;

  @ApiProperty({
    example: true,
    description: 'Filter by instant payment',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  transaction_instant_payment?: boolean;

  @ApiProperty({
    example: 'EUR',
    description: 'Filter by transaction currency',
    required: false,
  })
  @IsOptional()
  @IsString()
  transaction_currency?: string;

  @ApiProperty({
    example: 1200,
    description: 'Filter by transaction amount in cents',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  transaction_amount_cents?: number;

  @ApiProperty({
    example: 20,
    description: 'Filter by VAT amount in cents',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  transaction_vat?: number;

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
    description: 'Filter by transaction finish date before',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  transaction_finished_before?: Date;

  @ApiProperty({
    example: '2024-06-20',
    description: 'Filter by transaction finish date after',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  transaction_finished_after?: Date;
}
