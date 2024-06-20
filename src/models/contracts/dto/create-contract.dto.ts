import {
  IsString,
  IsNotEmpty,
  IsEnum,
  Matches,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContractDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(['RIBPAY', 'VADS'])
  @ApiProperty({
    description: 'Type of contract to be created.',
    example: 'RIBPAY',
    required: true,
    enum: ['RIBPAY', 'VADS'],
  })
  contract_type: 'RIBPAY' | 'VADS';

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{2}[0-9]{2}(?:[]?[a-zA-Z0-9]){18,30}$/)
  @ApiProperty({
    description: 'IBAN number for the contract.',
    example: 'FR1420041010050500013M02606',
    required: true,
  })
  iban: string;

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
  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: 'Unique identifier for the terminal.',
    example: 'f45b68fa-4586-4453-83af-ee2c1c2ecc27',
    required: false,
    type: 'string',
    format: 'uuid',
  })
  terminal_id?: string;
}
