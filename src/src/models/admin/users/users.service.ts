import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  UpdateUserDto,
} from './dto/update-user.dto';

import { PrismaService } from './../../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  
  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.users.findUnique({
      where: { user_id: id },
      include: {
        user_has_accounts: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const response = await this.prisma.users.update({
      where: { user_id: id },
      data: {
        user_first_name: updateUserDto?.first_name,
        user_last_name: updateUserDto?.last_name,
        user_birth_date: updateUserDto?.birth_date,
        user_birth_city: updateUserDto?.birth_city,
        user_birth_country: updateUserDto?.birth_country,
        user_last_modified: new Date(),
        user_phone: updateUserDto?.phone,
        user_email: updateUserDto?.email,
      },
    });

    return {
      ...response,
      user_role: user.user_has_accounts?.[0]?.user_role,
    };
  }

}
