import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { FilesAzureService } from '../validate/files-azure.service';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService, PrismaService, FilesAzureService],
})
export class AccountsModule {}
