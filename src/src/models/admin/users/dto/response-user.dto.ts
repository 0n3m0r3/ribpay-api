import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationResponseDto } from 'src/models/dto/pagination-response.dto';

enum UserRole {
  Admin = 'admin',
  User = 'user',
}
export class ResponseUserDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier of the user',
    type: 'string',
    format: 'uuid',
  })
  user_id: string;

  @ApiPropertyOptional({
    example: '2024-04-25T10:00:00Z',
    description: 'Time when the user profile was last modified',
    type: 'string',
    format: 'date-time',
  })
  user_last_modified?: Date;

  @ApiPropertyOptional({
    example: '2024-04-25T10:00:00Z',
    description: 'Time when the user profile was created',
    type: 'string',
    format: 'date-time',
  })
  user_created_at: Date;

  @ApiPropertyOptional({
    example: 'John',
    description: 'First name of the user',
  })
  user_first_name?: string;

  @ApiPropertyOptional({ example: 'Doe', description: 'Last name of the user' })
  user_last_name?: string;

  @ApiPropertyOptional({
    example: '1990-04-25',
    description: 'Birth date of the user',
    type: 'string',
    format: 'date',
  })
  user_birth_date?: string;

  @ApiPropertyOptional({
    example: 'New York',
    description: 'Birth city of the user',
  })
  user_birth_city?: string;

  @ApiPropertyOptional({
    example: 'USA',
    description: 'Birth country of the user',
  })
  user_birth_country?: string;

  @ApiPropertyOptional({
    example: '+1234567890',
    description: 'Phone number of the user',
  })
  user_phone?: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the user',
  })
  user_email: string;

  @ApiProperty({
    example: 'Admin',
    description: 'Identifier of the user who created this user profile',
    type: 'string',
    format: 'uuid',
  })
  creator_id: string;
}

class UserHasAccount {
  @ApiProperty({
    example: 'admin',
    description: 'Role of the user',
    enum: UserRole,
  })
  user_role: UserRole;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier of the account',
    type: 'string',
    format: 'uuid',
  })
  account_id: string;
}

export class ResponseSingleUserDto extends ResponseUserDto {
  @ApiProperty({
    description: 'User account details',
    type: UserHasAccount,
  })
  accounts: UserHasAccount[];
}

export class ResponseUserRoleDto extends ResponseUserDto {
  @ApiProperty({
    example: 'admin',
    description: 'Role of the user',
    enum: UserRole,
  })
  user_role: UserRole;
}

export class ResponseMoveDTO {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier of the account',
    type: 'string',
    format: 'uuid',
  })
  account_id: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier of the user',
    type: 'string',
    format: 'uuid',
  })
  user_id: string;

  @ApiProperty({
    example: 'admin',
    description: 'Role of the user',
    enum: UserRole,
  })
  user_role: UserRole;
}

export class ResponseListUserDto {
  Users: ResponseUserDto[];
  Pagination: PaginationResponseDto;
}
