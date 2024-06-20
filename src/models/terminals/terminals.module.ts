import { Module } from '@nestjs/common';
import { TerminalsService } from './terminals.service';
import { TerminalsController } from './terminals.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TerminalsController],
  providers: [TerminalsService, PrismaService],
})
export class TerminalsModule {}
