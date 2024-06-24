import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsAmountFormatCorrect } from 'src/decorators/is-valid-amount.decorator';

export class CreateTransactionDto {
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Flag to indicate if the payment is instant.',
    example: true,
    required: true,
  })
  instant_payment: boolean;

  @IsEnum(['EUR'])
  @IsOptional()
  @ApiProperty({
    description: 'Currency of the payment',
    example: 'EUR',
    required: false,
  })
  currency?: string;

  
  @IsNotEmpty()
  @IsAmountFormatCorrect({ message: 'Amount must be in supported format. See docs'})
  @ApiProperty({
    description: 'Amount of the payment in cents.',
    example: 1000,
    required: true,
  })
  amount_cents: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Currency of the payment',
    example: 'EUR',
    required: true,
  })
  label: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({
    description: 'URL for transaction authentication',
    example: 'https://example.com/auth',
    required: true,
  })
  redirect_url: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({
    description: 'URL for transaction notifications',
    example: 'https://example.com/notify',
    required: true,
  })
  notification_url: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Unique identifier for the account.',
    example: 'b9f8e467-90a2-4976-9cd5-1624bdd80ab4',
    type: 'string',
    format: 'uuid',
    required: true,
  })
  account_id: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Unique identifier for the terminal.',
    example: 'f45b68fa-4586-4453-83af-ee2c1c2ecc27',
    type: 'string',
    format: 'uuid',
    required: true,
  })
  terminal_id: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Unique identifier for the contract.',
    example: 'f45b68fa-4586-4453-83af-ee2c1c2ecc27',
    type: 'string',
    format: 'uuid',
    required: true,
  })
  contract_id: string;

  @IsNotEmpty()
  amount_calculated: number;
}
