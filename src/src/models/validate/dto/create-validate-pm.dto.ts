import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AccountDetailsDto } from 'src/models/accounts/dto/response-account.dto';

export class CreateValidatePmDto {
  @ApiProperty({
    description: 'File to be validated.',
    type: 'string',
    format: 'binary',
    required: true,
  })
  @IsNotEmpty({ message: 'File must be provided.' })
  file: any;
}

export class CreateValidatePmResponseDto {
  @ApiProperty({
    description: 'Account that the file was validated for.',
    type: AccountDetailsDto,
    required: true,
  })
  account: AccountDetailsDto;
}
