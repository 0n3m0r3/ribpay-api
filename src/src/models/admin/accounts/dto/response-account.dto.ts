import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BillingAddressDto } from '../../../billing-addresses/dto/response-billing-addresse.dto';
import { TerminalDto } from '../../../terminals/dto/response-terminal.dto';
import { PaginationDto } from 'src/models/dto/pagination.dto';
import { PaginationResponseDto } from 'src/models/dto/pagination-response.dto';

export class AccountDetailsDto {
  @ApiProperty({
    example: 'efc21e45-79d1-48d8-ac19-ea0ecaef2bc5',
    description: 'Unique identifier for the account.',
    type: 'string',
    format: 'uuid',
  })
  account_id: string;

  @ApiProperty({
    example: '2021-09-01T09:00:00Z',
    description: 'Timestamp for the account creation.',
  })
  account_last_modified?: string;

  @ApiProperty({
    example: '12345678901234',
    description: 'Siret number of the account.',
  })
  account_national_id: string;

  @ApiProperty({
    example: 'FORTAINE SOFTWARE',
    description: 'Name of the account. Defined by the SIRET number.',
  })
  account_name: string;

  @ApiProperty({
    example: 'personneMorale',
    description: 'Type of the account.',
    type: 'enum',
    enum: ['personneMorale', 'personnePhysique'],
  })
  account_type: 'personneMorale' | 'personnePhysique';

  @ApiProperty({
    example: 'FR',
    description: 'Country code of the account.',
  })
  account_country: string;

  @ApiProperty({
    example: true,
    description: 'Status of the account. For more infos see /validate',
    type: 'boolean',
  })
  account_is_active: boolean;

  @ApiProperty({
    example: '2021-09-01T09:00:00Z',
    description: 'Timestamp for the account deletion.',
  })
  account_deletion_date?: string;

  @ApiProperty({
    example: '2021-09-01T09:00:00Z',
    description: 'Timestamp for the account creation.',
  })
  account_created_at: string;

  @ApiProperty({
    example: 'EUR',
    description: 'Currency of the account. Only EUR supported for now.',
  })
  account_currency: string;

  @ApiProperty({
    example: 'louka.altdorf-reynes@ribpay.app',
    description:
      'Notification email for the account, will get notified for each successful payment.',
  })
  account_notification_email: string;

  @ApiProperty({
    example:
      'http://localhost:3001/account/TestKey1/efc21e45-79d1-48d8-ac19-ea0ecaef2bc5',
    description: 'URL for account activation. For more infos see /validate',
  })
  account_creation_url: string;

  @ApiProperty({
    example:
      'http://localhost:3001/account/TestKey1/efc21e45-79d1-48d8-ac19-ea0ecaef2bc5',
    description: 'URl for blob storage. For more infos see /validate/pm',
  })
  account_blob_storage_url?: string;

  account_logo_url?: string;

  @ApiProperty({
    example: 'partner_id',
    description: 'Partner id of the account.',
    type: 'string',
    format: 'uuid',
  })
  partner_id: string;

  @ApiProperty({
    example: 'TestKey1',
    description: 'ID of the creator of the account',
    type: 'string',
    format: 'uuid',
  })
  creator_id: string;
}

export class AccountListResponseDto {
  Accounts: AccountDetailsDto[];
  Pagination: PaginationResponseDto;
}
