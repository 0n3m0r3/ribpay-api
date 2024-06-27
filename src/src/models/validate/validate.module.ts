import { Module } from '@nestjs/common';
import { ValidateService } from './validate.service';
import { ValidateController } from './validate.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilesAzureService } from './files-azure.service';

@Module({
  controllers: [ValidateController],
  providers: [ValidateService, PrismaService, FilesAzureService],
})
export class ValidateModule {}
