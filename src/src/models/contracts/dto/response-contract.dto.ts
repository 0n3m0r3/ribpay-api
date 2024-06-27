import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationResponseDto } from 'src/models/dto/pagination-response.dto';

export class ContractResponseDto {
  @ApiProperty({
    example: 'be4118e9-a345-42ee-8af4-ea63a45708b7',
    description: 'Unique identifier of the contract',
    type: 'string',
    format: 'uuid',
  })
  contract_id: string;

  @ApiProperty({
    description: 'Timestamp of the creation of the contract',
    type: 'string',
    format: 'date-time',
  })
  contract_created_at: Date;

  @ApiPropertyOptional({
    description: 'Timestamp of the last modification to the contract',
    type: 'string',
    format: 'date-time',
  })
  contract_last_modified: Date | null;

  @ApiProperty({ example: 'RIBPAY', description: 'Type of the contract' })
  contract_type: string;

  @ApiProperty({
    example: 'OXLN_K6CSK68ZZZSK6DZZZSK6DK6CSK68',
    description: 'Contract number',
  })
  contract_number: string;

  @ApiProperty({
    example: 'FORTAINE SOFTWARE',
    description: 'Name of the beneficiary of the contract',
  })
  contract_beneficiary_name: string;

  @ApiProperty({
    example: '99999999-ffff-9999-ffff-999999999999',
    description: 'Merchant ID associated with the contract',
  })
  contract_merchant_id: string;

  @ApiProperty({
    example: 'e227c3b0-751e-49ea-b2b8-99b263233b2b',
    description: 'Alias ID for the contract',
  })
  contract_alias_id: string;

  @ApiPropertyOptional({
    example: 'e227c3b0-751e-49ea-b2b8-99b263233b2b',
    description: 'ID of the terminal associated with the contract',
    type: 'string',
    format: 'uuid',
  })
  terminal_id: string | null;

  @ApiProperty({
    example: 'efc21e45-79d1-48d8-ac19-ea0ecaef2bc5',
    description: 'Account ID associated with the contract',
    type: 'string',
    format: 'uuid',
  })
  account_id: string;

  @ApiProperty({
    example: 'TestKey1',
    description: 'ID of the creator of the contract',
    type: 'string',
    format: 'uuid',
  })
  creator_id: string;
}

export class ContractListResponseDto {
  Contracts: ContractResponseDto[];
  Pagination: PaginationResponseDto;
}
