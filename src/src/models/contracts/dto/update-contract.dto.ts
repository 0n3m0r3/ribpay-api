import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateContractDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'Unique identifier for the terminal.',
    example: 'b9f8e467-90a2-4976-9cd5-1624bdd80ab4',
    required: true,
    type: 'string',
    format: 'uuid',
  })
  terminal_id: string;
}
