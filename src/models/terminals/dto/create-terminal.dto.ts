import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum SubscriptionType {
  Classic = 'ribpay_classic',
  Plus = 'ribpay_plus',
}

enum ContractType {
  RIBPAY = 'RIBPAY',
  VADS = 'VADS',
}

export class CreateTerminalDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'Unique identifier for the account.',
    example: 'b9f8e467-90a2-4976-9cd5-1624bdd80ab4',
    required: true,
    type: 'string',
    format: 'uuid',
  })
  account_id: string;

  @IsString()
  @IsEnum(ContractType, {
    message: `contract_type must be one of the following values: ${Object.values(ContractType).join(', ')}`,
  })
  @IsOptional()
  @ApiProperty({
    description: 'Type of contract to be shown first. Can be null',
    example: 'RIBPAY',
    required: false,
    enum: ['RIBPAY', 'VADS'],
  })
  favorite_contract_type?: 'RIBPAY' | 'VADS';

  @IsString()
  @IsOptional()
  @ApiProperty({
    description:
      'Label/name of the terminal. Will default to "New Terminal" if not provided.',
    example: 'New Terminal',
    required: false,
  })
  label?: string;

  @IsEnum(SubscriptionType, {
    message: `subscription_type must be one of the following values: ${Object.values(SubscriptionType).join(', ')}`,
  })
  @IsOptional()
  @ApiProperty({
    description: 'Type of subscription for the terminal.',
    example: 'ribpay_classic',
    required: false,
    enum: ['ribpay_classic', 'ribpay_plus'],
  })
  subscription_type?: 'ribpay_classic' | 'ribpay_plus';
}
