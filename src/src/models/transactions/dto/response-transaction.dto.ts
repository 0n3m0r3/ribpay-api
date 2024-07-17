import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponseDto } from 'src/models/dto/pagination-response.dto';

export class TransactionResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier of the transaction',
    type: 'string',
    format: 'uuid',
  })
  transaction_id: string;

  @ApiProperty({
    example: '2024-04-25T10:00:00Z',
    description: 'Time when the transaction was last modified',
    type: 'string',
    format: 'date-time',
  })
  transaction_last_modified?: Date;

  @ApiProperty({
    example: 'OXLIN_123456789',
    description: 'Transaction identifier',
  })
  transaction_id_oxlin: string;

  @ApiProperty({
    description: 'Subscription identifier',
  })
  transaction_subscription_id: string;

  @ApiProperty({
    example: 'completed',
    description: 'Current status of the transaction',
  })
  transaction_status: string;

  @ApiProperty({
    example: true,
    description: 'Indicates if the transaction was an instant payment',
  })
  transaction_instant_payment: boolean;

  @ApiProperty({
    example: 1000,
    description: 'Transaction amount in cents without VAT',
  })
  transaction_amount_without_vat: number;

  @ApiProperty({
    example: 1200,
    description: 'Total transaction amount in cents',
  })
  transaction_amount_cents: number;

  @ApiProperty({
    description: 'Decimal representation of the transaction amount',
    example: 10.0,
  })
  transaction_amount_calculated: number;

  @ApiProperty({ example: 'EUR', description: 'Currency of the transaction' })
  transaction_currency: string;

  @ApiProperty({ example: 20, description: 'VAT amount in cents' })
  transaction_vat: number;

  @ApiProperty({
    example: 'Transaction for service',
    description: 'Label of the transaction',
  })
  transaction_label: string;

  @ApiProperty({
    example: 'https://example.com/auth',
    description: 'URL for transaction authentication',
    type: 'string',
  })
  transaction_auth_url: string;

  @ApiProperty({
    example: 'https://example.com/redirect',
    description: 'URL to redirect after transaction completion',
    type: 'string',
  })
  transaction_redirect_url: string;

  @ApiProperty({
    example: 'https://example.com/notify',
    description: 'URL for transaction notifications',
    type: 'string',
  })
  transaction_notification_url: string;

  @ApiProperty({
    description: 'Email for transaction notifications',
    type: 'string',
  })
  transaction_notification_email: string;

  @ApiProperty({
    example: '2024-04-25T10:00:00Z',
    description: 'Time when the transaction was initiated',
    format: 'date-time',
  })
  transaction_initiated: Date;

  @ApiProperty({
    example: '2024-04-25T10:00:00Z',
    description: 'Time when the transaction was finished',
    format: 'date-time',
  })
  transaction_finished: Date;

  @ApiProperty({
    description: 'Metadata of the transaction',
    format: 'JSON',
  })
  transaction_metadata: JSON;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Account associated with the transaction',
    type: 'string',
    format: 'uuid',
  })
  account_id: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Contract associated with the transaction',
    type: 'string',
    format: 'uuid',
  })
  contract_id?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Terminal associated with the transaction',
    type: 'string',
    format: 'uuid',
  })
  terminal_id: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Installment associated with the transaction',
    type: 'string',
    format: 'uuid',
  })
  installment_id?: string;

  @ApiProperty({
    example: 'Admin',
    description: 'Creator of the transaction',
    type: 'string',
    format: 'uuid',
  })
  creator_id: string;
}

export class ResponseListTransactionDto {
  Transactions: TransactionResponseDto[];
  Pagination: PaginationResponseDto;
}
