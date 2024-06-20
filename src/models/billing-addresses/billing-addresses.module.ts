import { Module } from '@nestjs/common';
import { BillingAddressesService } from './billing-addresses.service';
import { BillingAddressesController } from './billing-addresses.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [BillingAddressesController],
  providers: [BillingAddressesService, PrismaService],
})
export class BillingAddressesModule {}
