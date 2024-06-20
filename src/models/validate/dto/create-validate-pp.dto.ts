import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { AccountDetailsDto } from 'src/models/accounts/dto/response-account.dto';
import { ResponseUserDto } from 'src/models/users/dto/response-user.dto';
import { IsDateFormatCorrect } from 'src/decorators/is-valid-date.decorator';

export class CreateValidatePpDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'First name of the person.',
    example: 'John',
    required: true,
  })
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Last name of the person.',
    example: 'Doe',
    required: true,
  })
  last_name: string;

  @IsString()
  @IsNotEmpty()
  @IsDateFormatCorrect({ message: 'Date must be in supported format. See docs or use YYYY/MM/DD' })
  @ApiProperty({
    description: 'Birth date of the person.',
    example: '1990/04/25',
    required: true,
  })
  birth_date: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Birth city of the person.',
    example: 'New York',
    required: true,
  })
  birth_city: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Birth country of the person.',
    example: 'USA',
    required: true,
  })
  birth_country: string;
}

export class ResponseValidatePpDto {
  @ApiProperty({
    description: 'Account that the person was validated for.',
    type: AccountDetailsDto,
    required: true,
  })
 account: AccountDetailsDto;

  @ApiProperty({
    description: 'User that was validated.',
    type: ResponseUserDto,
    required: true,
  })
 user: ResponseUserDto;
}