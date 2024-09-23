import { ApiProperty } from '@nestjs/swagger';

import { TransactionStatus } from '../../../../lib/enums/index';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTransactionDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'CLOSED',
    description: 'Modify the status of the transaction to close it',
  })
  status: TransactionStatus;
}
