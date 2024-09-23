import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from './../../../prisma/prisma.service';
import { ResponsePartnersDto } from './dto/response-partners.dto';

@Injectable()
export class PartnersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string): Promise<ResponsePartnersDto> {
    const partner = await this.prisma.partners.findUnique({
      where: { creator_id: id },
    });

    if (!partner) {
      throw new NotFoundException('Partner does not exist');
    }

    return partner;
  }
}
