import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
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
    example: 'test@mail.com',
    required: false,
  })
  email?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Phone number of the user.',
    example: '+1234567890',
    required: false,
  })
  phone?: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Unique identifier of the account to which the user belongs.',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
    type: 'string',
    format: 'uuid',
  })
  account_id: string;
}
