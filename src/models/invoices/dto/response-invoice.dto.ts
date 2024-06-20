import { ApiProperty } from '@nestjs/swagger';

export class InvoiceDto {
  @ApiProperty({
    example: '8bb66aff-41c5-41c6-a69f-18efd7c9e155',
    description: 'Unique identifier for the invoice',
    type: 'string',
  })
  invoice_id: string;

  @ApiProperty({ example: 1, description: 'Sequential ID of the invoice' })
  sequential_id: number;

  @ApiProperty({ example: 'RIB-6B6B-294-001', description: 'Invoice number' })
  number: string;

  @ApiProperty({
    example: '2024-04-18',
    description: 'Date when the invoice was issued',
    type: 'string',
    format: 'date',
  })
  issuing_date: string;

  @ApiProperty({ example: 'subscription', description: 'Type of the invoice' })
  invoice_type: string;

  @ApiProperty({ example: 'EUR', description: 'Currency used for the invoice' })
  currency: string;

  @ApiProperty({ example: 0, description: 'Total fees amount in cents' })
  fees_amount_cents: number;

  @ApiProperty({ example: 0, description: 'Total taxes amount in cents' })
  taxes_amount_cents: number;

  @ApiProperty({ example: 0, description: 'Total discounts amount in cents' })
  coupons_amount_cents: number;

  @ApiProperty({ example: 0, description: 'Total credits amount in cents' })
  credit_notes_amount_cents: number;

  @ApiProperty({
    example: 0,
    description: 'Total amount in cents without taxes',
  })
  sub_total_excluding_taxes_amount_cents: number;

  @ApiProperty({ example: 0, description: 'Total amount in cents with taxes' })
  sub_total_including_taxes_amount_cents: number;

  @ApiProperty({ example: 0, description: 'Total amount in cents' })
  total_amount_cents: number;

  @ApiProperty({ example: 0, description: 'Prepaid amount in cents' })
  prepaid_credit_amount_cents: number;

  @ApiProperty({ example: 0, description: 'Currency' })
  amount_currency: string;

  @ApiProperty({ example: 0, description: 'VAT Currency' })
  vat_amount_currency: string;

  @ApiProperty({ example: 0, description: 'Credit amount currency' })
  credit_amount_currency: string;

  @ApiProperty({ example: 0, description: 'Total amount currency' })
  total_amount_currency: string;

  @ApiProperty({ example: 0, description: 'Total amount in cents' })
  amount_cents: number;

  @ApiProperty({ example: 0, description: 'Credit amount in cents' })
  credit_amount_cents: number;

  @ApiProperty({ example: 0, description: 'VAT amount in cents' })
  vat_amount_cents: number;

  @ApiProperty({
    example: 0,
    description: 'Sub total amount in cents without taxes',
  })
  sub_total_vat_excluded_amount_cents: number;

  @ApiProperty({
    example: 0,
    description: 'Sub total amount in cents with taxes',
  })
  sub_total_vat_included_amount_cents: number;
}

export class MetaDto {
  @ApiProperty({ example: 1, description: 'Current page number' })
  current_page: number;

  @ApiProperty({ example: 1, description: 'Next page number, if available' })
  next_page?: number;

  @ApiProperty({
    example: 1,
    description: 'Previous page number, if available',
  })
  prev_page?: number;

  @ApiProperty({ example: 1, description: 'Total number of pages available' })
  total_pages: number;

  @ApiProperty({ example: 1, description: 'Total number of items available' })
  total_count: number;
}

export class InvoiceResponseDto {
  @ApiProperty({ type: [InvoiceDto], description: 'List of invoices' })
  invoices: InvoiceDto[];

  @ApiProperty({ type: MetaDto, description: 'Pagination metadata' })
  meta: MetaDto;
}
