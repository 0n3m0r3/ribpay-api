import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponseDto } from 'src/models/dto/pagination-response.dto';

export class TerminalDto {
  @ApiProperty({
    example: 'f45b68fa-4586-4453-83af-ee2c1c2ecc27',
    description: 'Unique identifier for the terminal.',
    type: 'string',
    format: 'uuid',
  })
  terminal_id: string;

  @ApiProperty({
    example: 'New Terminal',
    description: 'Label/name of the terminal.',
  })
  terminal_label: string;

  @ApiProperty({
    example: 'RIBPAY',
    description: 'Type of contract to be shown first.',
  })
  terminal_favorite_contract_type: 'RIBPAY' | 'VADS';

  @ApiProperty({
    example: 'payments',
    description: 'Type of subscription for the terminal.',
  })
  terminal_subscription_type: 'ribpay_classic' | 'ribpay_plus';

  @ApiProperty({
    example: '2021-09-30T17:00:00.000Z',
    description: 'Date the terminal was created.',
  })
  terminal_created_at: string;

  @ApiProperty({
    example: '2021-09-30T17:00:00.000Z',
    description: 'Date the terminal was modified.',
  })
  terminal_last_modified: string;

  @ApiProperty({
    example: 'b9f8e467-90a2-4976-9cd5-1624bdd80ab4',
    description: 'Unique identifier for the account.',
    type: 'string',
    format: 'uuid',
  })
  account_id: string;

  @ApiProperty({
    example: 'b9f8e467-90a2-4976-9cd5-1624bdd80ab4',
    description: 'Unique identifier for the subscription.',
    type: 'string',
    format: 'uuid',
  })
  terminal_subscription_id: string;

  @ApiProperty({
    example: 'b9f8e467-90a2-4976-9cd5-1624bdd80ab4',
    description: 'Unique identifier for the creator.',
    type: 'string',
    format: 'uuid',
  })
  creator_id: string;
}

export class TerminalListDto {
  Terminals: TerminalDto[];
  Pagination: PaginationResponseDto;
}
