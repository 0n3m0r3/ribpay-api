import { ApiProperty } from '@nestjs/swagger';

import { AdminTransactionStatus } from '../../../../lib/enums/index';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateTransactionDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'CLOSED',
    description: 'Modify the status of the transaction to close it',
  })
  status: AdminTransactionStatus;

  @IsUUID()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '5b67e1fc-5bb8-4057-b414-6610cb5c9228',
    description: 'transaction id oxlin',
  })
  transaction_id_oxlin: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '2024-09-24T11:11:25.593Z',
    description: 'last modification date',
  })
  transaction_last_modified: string;
  
}
