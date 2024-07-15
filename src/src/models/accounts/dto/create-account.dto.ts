import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';
import { IsSiret } from '../../../decorators/is-valid-siret.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionType } from 'src/lib/enums';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  @IsSiret({ message: 'Invalid SIRET number provided.' })
  @ApiProperty({
    description:
      'The SIRET number of the account (only valid SIRET numbers are accepted).',
    example: '12345678901234',
    required: true,
  })
  siret: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Country code of the account',
    example: 'FR',
    required: true,
  })
  country: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description:
      'Notification email for the account, will get notified for each successful payment.',
    example: 'info@example.com',
    required: true,
  })
  notification_email: string;

  @IsString()
  @IsOptional()
  @IsEnum(SubscriptionType, {
    message: `subscription_type must be one of the following values: ${Object.values(SubscriptionType).join(', ')}`,
  })
  @ApiProperty({
    description: 'Type of subscription for the terminal that will be created.',
    example: 'ribpay_plus',
    required: false,
    enum: ['ribpay_classic', 'ribpay_plus'],
    default: 'ribpay_classic',
  })
  subscription_type?: 'ribpay_classic' | 'ribpay_plus';
}
