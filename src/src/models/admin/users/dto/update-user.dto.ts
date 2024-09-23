import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateFormatCorrect } from 'src/decorators/is-valid-date.decorator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'First name of the user.',
    example: 'John',
    required: false,
  })
  first_name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Last name of the user.',
    example: 'Doe',
    required: false,
  })
  last_name?: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({
    description: 'Email address of the user.',
    example: 'example@mail.com',
    required: false,
  })
  email?: string;

  @IsPhoneNumber('FR')
  @IsOptional()
  @ApiProperty({
    description: 'Phone number of the user.',
    example: '+33612345678',
    required: false,
  })
  phone?: string;

  @IsString()
  @IsOptional()
  @IsDateFormatCorrect({ message: 'Date must be in supported format. See docs or use YYYY/MM/DD' })
  @ApiProperty({
    description: 'Birth date of the user.',
    example: '1990/04/25',
    required: false,
  })
  birth_date?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Birth city of the user.',
    example: 'New York',
    required: false,
  })
  birth_city?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Birth country of the user.',
    example: 'USA',
    required: false,
  })
  birth_country?: string;
}

export class AddUserToAccountDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Unique identifier of the account to which the user belongs.',
    example: '123e4567-e 89b-12d3-a456-426614174000',
    required: true,
    type: 'string',
    format: 'uuid',
  })
  account_id: string;
}

export class RemoveUserFromAccountDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'Unique identifier of the account from which the user is removed.',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
    type: 'string',
    format: 'uuid',
  })
  account_id: string;
}
