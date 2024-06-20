import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class BillingAddressesService {
  constructor(private prisma: PrismaService) {}
  async findOne(id: string, subAccount: string) {
    const billing_address = await this.prisma.billing_addresses.findUnique({
      where: { billing_address_id: id, creator_id: subAccount },
    });
    if (!billing_address) {
      throw new NotFoundException('Billing address not found');
    }
    return billing_address;
  }

  async findByAccount(account_id: string, subAccount: string) {
    const account = await this.prisma.accounts.findUnique({
      where: { account_id: account_id, creator_id: subAccount },
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    const billing_addresses = await this.prisma.billing_addresses.findMany({
      where: { account_id: account_id, creator_id: subAccount },
    });
    return billing_addresses;
  }
}
