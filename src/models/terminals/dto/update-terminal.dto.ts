import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

enum ContractType {
  RIBPAY = 'RIBPAY',
  VADS = 'VADS',
}
export class UpdateTerminalDto {
  @IsEnum(ContractType, {
    message: `contract_type must be one of the following values: ${Object.values(ContractType).join(', ')}`,
  })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Type of contract to be created.',
    example: 'RIBPAY',
    enum: ['RIBPAY', 'VADS'],
  })
  favorite_contract_type?: 'RIBPAY' | 'VADS';

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Label/name of the terminal.',
    example: 'New Terminal',
  })
  label?: string;
}
