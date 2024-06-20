import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { TransactionResponseDto } from '../transactions/dto/response-transaction.dto';

export class PaginationResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Current page number',
  })
  current_page: number;

  @ApiProperty({
    example: 2,
    description: 'Next page number, null if no next page',
    nullable: true,
  })
  next_page: number | null;

  @ApiProperty({
    example: null,
    description: 'Previous page number, null if no previous page',
    nullable: true,
  })
  prev_page: number | null;

  @ApiProperty({
    example: 10,
    description: 'Number of items per page',
  })
  per_page: number;

  @ApiProperty({
    example: 10,
    description: 'Total number of pages',
  })
  total_pages: number;

  @ApiProperty({
    example: 100,
    description: 'Total number of items',
  })
  total_count: number;

  @ApiProperty({
    example: 'http://example.com/api/items?page=2&per_page=10',
    description: 'URL to the next page of items, null if no next page',
    nullable: true,
  })
  next_link: string | null;

  @ApiProperty({
    example: 'http://example.com/api/items?page=1&per_page=10',
    description: 'URL to the previous page of items, null if no previous page',
    nullable: true,
  })
  prev_link: string | null;
}
