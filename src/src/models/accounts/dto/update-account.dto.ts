import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateAccountDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'Notification email for the account, will get notified for each successful payment.',
    example: 'user@example.com',
    required: true,
})
  notification_email: string;
}
