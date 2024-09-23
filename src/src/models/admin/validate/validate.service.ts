import {
  BadRequestException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { CreateValidatePpDto } from './dto/create-validate-pp.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ValidateService {
  constructor(private prisma: PrismaService) {}

  async userHasAccounts(id: string) {

    const account = await this.prisma.accounts.findUnique({
      where: {
        account_id: id,
      },

    });
    if (!account) throw new NotFoundException('Account not found');

    const userWithAdminRole = await this.prisma.user_has_accounts.findFirst({
      where: {
        account_id: id,
        user_role: 'admin',
      },
    });

    if (!userWithAdminRole) throw new NotFoundException('User not found');

    const user = await this.prisma.users.findUnique({
      where: {
        user_id: userWithAdminRole.user_id,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;

  }

}
