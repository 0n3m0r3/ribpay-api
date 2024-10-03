import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccountDetailsDto } from './dto/response-account.dto';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  // Updated findOne method to only use account ID
  async findOne(accountId: string): Promise<AccountDetailsDto> {
    const account = await this.prisma.accounts.findUnique({
      where: {
        account_id: accountId,
      },
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return account as unknown as AccountDetailsDto;
  }

  async activate(accountId: string): Promise<AccountDetailsDto> {
    const account = await this.prisma.accounts.findUnique({
      where: {
        account_id: accountId,
      },
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    if(account.account_is_active) {
      throw new BadRequestException('Account is already active');
    }
    await this.prisma.accounts.update({
      where: {
        account_id: accountId,
      },
      data: {
        account_is_active: true,
        account_last_modified: new Date(),
      },
    });

    return account as unknown as AccountDetailsDto;
  }
}
