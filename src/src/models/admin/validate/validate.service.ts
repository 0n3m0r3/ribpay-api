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

  async validatePp(
    id: string,
    createValidatePpDto: CreateValidatePpDto,
  ) {
    const account = await this.prisma.accounts.findUnique({
      where: {
        account_id: id
      },
    });

    if (!account) throw new NotFoundException('Account not found');
    if (account.account_deletion_date)
      throw new BadRequestException('Account has been deleted');
    if (account.account_is_active === true)
      throw new BadRequestException('Account is already active');

    const userWithAdminRole = await this.prisma.user_has_accounts.findFirst({
      where: {
        account_id: id,
        user_role: 'admin',
      },
    });

    const user = await this.prisma.users.update({
      where: {
        user_id: userWithAdminRole.user_id
      },
      data: {
        user_first_name: createValidatePpDto.first_name,
        user_last_name: createValidatePpDto.last_name,
        user_birth_date: createValidatePpDto.birth_date,
        user_birth_city: createValidatePpDto.birth_city,
        user_birth_country: createValidatePpDto.birth_country,
      },
    });

    const accountUpdate = await this.prisma.accounts.update({
      where: {
        account_id: id
      },
      data: {
        account_is_active: true,
      },
    });

    const responseItem = {
      message: 'Account activated',
      user: user,
      account: accountUpdate,
    };

    return responseItem;
  }

}
