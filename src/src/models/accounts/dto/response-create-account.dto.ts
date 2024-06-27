import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AccountDetailsDto } from './response-account.dto';
import { BillingAddressDto } from '../../billing-addresses/dto/response-billing-addresse.dto';
import { TerminalDto } from '../../terminals/dto/response-terminal.dto';
import { UserRole } from 'src/lib/enums';

class UserDto {
  @ApiProperty({
    example: 'dddb97cb-4187-40e1-a46b-702fcbf067fd',
    description:
      'Unique identifier for the user created. Is the only user of the account with "admin" role.',
    type: 'string',
    format: 'uuid',
  })
  user_id: string;

  @ApiProperty({
    example: 'admin',
    description: 'Role of the user',
    enum: UserRole,
  })
  user_role: UserRole;

  @ApiProperty({
    example: 'Admin',
    description: 'Identifier of the user who created this user profile',
    type: 'string',
    format: 'uuid',
  })
  creator_id: string;
}

export class AccountCreateResponseDto {
  @ApiProperty({
    description: 'Details about the account created.',
    type: AccountDetailsDto,
  })
  account: AccountDetailsDto;

  @ApiProperty({
    description: 'Billing address associated with the account.',
    type: BillingAddressDto,
  })
  billing_address: BillingAddressDto;

  @ApiPropertyOptional({
    description: 'Information about the terminal associated with the account.',
    type: TerminalDto,
  })
  terminal: TerminalDto;

  @ApiPropertyOptional({
    description: 'User details associated with the account.',
    type: UserDto,
  })
  user: UserDto;
}
