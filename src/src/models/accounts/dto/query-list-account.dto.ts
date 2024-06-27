import { AccountType } from 'src/lib/enums';
import { IsOptional, IsString, IsBoolean, IsDate, IsEnum } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PaginationDto } from 'src/models/dto/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AccountListQueryDto extends PaginationDto {
  @ApiProperty({
    example: 'search term',
    description: 'Search term for filtering accounts',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    example: 'account_id',
    description: 'Filter by account ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  account_id?: string;

  @ApiProperty({
    example: 'partner_id',
    description: 'Filter by partner ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  partner_id?: string;

  @ApiProperty({
    example: '2023-01-01',
    description: 'Filter by creation date before',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  created_before?: Date;

  @ApiProperty({
    example: '2023-01-01',
    description: 'Filter by creation date after',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  created_after?: Date;

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

  @ApiProperty({
    example: '2023-01-01',
    description: 'Filter by deletion date before',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  deleted_before?: Date;

  @ApiProperty({
    example: '2023-01-01',
    description: 'Filter by deletion date after',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  deleted_after?: Date;

  @ApiProperty({
    example: true,
    description: 'Filter by active status',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  is_active?: boolean;

  @ApiProperty({
    example: AccountType,
    description: 'Filter by account type',
    required: false,
  })
  @IsOptional()
  @IsEnum(AccountType)
  type?: AccountType;

  @ApiProperty({
    example: true,
    description: 'Filter by deletion status',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  is_deleted?: boolean;
}
