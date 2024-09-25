import { IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminUpdateContractDto {
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Contract is active',
    example: true,
    required: true,
    type: Boolean,
  })
  contract_is_active: Boolean;
}
