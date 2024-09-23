import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResponsePartnersDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier of the partner',
    type: 'string',
    format: 'uuid',
  })
  partner_id: string;

  @ApiProperty({
    example: 'Acme Corporation',
    description: 'Name of the partner',
    type: 'string',
  })
  partner_name: string;

  @ApiPropertyOptional({
    example: 'https://example.com/notify',
    description: 'URL for partner notifications, null if not set',
    type: 'string',
    nullable: true,
  })
  notification_url: string | null;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Identifier of the user who created this partner profile',
    type: 'string',
    format: 'uuid',
  })
  creator_id: string;
}
