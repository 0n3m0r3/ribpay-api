// src/models/contracts/dto/base-contract.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  Matches,
  IsOptional,
  IsUUID,
  IsBoolean,
  IsInt,
  ValidateIf,
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


export class CreateRIBPayContractDto extends CreateContractDto {


  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{2}[0-9]{2}(?:[]?[a-zA-Z0-9]){18,30}$/)
  @ApiProperty({
    description: 'IBAN number for the contract.',
    example: 'FR1420041010050500013M02606',
    required: true,
  })
  iban: string;

}


export class CreateVADSContractDto extends CreateContractDto {

  @ValidateIf(o => o.contract_type === 'VADS')
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Merchant ID for the contract.',
    example: '123456789',
    required: true,
  })
  contract_merchant_id: string;



  @ValidateIf(o => o.contract_type === 'VADS')
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the bank for the contract.',
    example: 'BANQUE POPULAIRE AQUITAINE CENTRE ATLANTIQUE',
    required: true,
  })
  contract_bank_name: string;

  @ValidateIf(o => o.contract_type === 'VADS')
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Code of the bank for the contract.',
    example: '10907',
    required: true,
  })
  contract_bank_code: string;

  @ValidateIf(o => o.contract_type === 'VADS')
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Is 3D Secure active for the contract.',
    example: true,
    required: true,
  })
  contract_3d_secure: boolean;

  @ValidateIf(o => o.contract_type === 'VADS')
  @IsInt()
  @IsEnum([100, 250, 500, 1000, 1500, 2500, 5000, 10000])
  @IsNotEmpty()
  @ApiProperty({
    description: 'Max amount for the contract.',
    example: 10000,
    required: true,
    enum: [100, 250, 500, 1000, 1500, 2500, 5000, 10000],
  })
  contract_max_amount: number;
}
