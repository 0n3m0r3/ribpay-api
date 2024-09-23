import { Module } from '@nestjs/common';
import { ValidateService } from './validate.service';
import { ValidateController } from './validate.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ValidateController],
  providers: [ValidateService, PrismaService],
})
export class AdminValidateModule {}
