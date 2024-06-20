import {
  BadRequestException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { CreateValidatePpDto } from './dto/create-validate-pp.dto';
import { CreateValidatePmDto } from './dto/create-validate-pm.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  BlobServiceClient,
  BlockBlobClient,
  ContainerClient,
  StorageSharedKeyCredential,
} from '@azure/storage-blob';

@Injectable()
export class ValidateService {
  constructor(private prisma: PrismaService) {}

  async createPp(
    id: string,
    createValidatePpDto: CreateValidatePpDto,
    subAccount: any,
  ) {
    const account = await this.prisma.accounts.findUnique({
      where: {
        account_id: id,
        creator_id: subAccount,
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
        user_id: userWithAdminRole.user_id,
        creator_id: subAccount,
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
        account_id: id,
        creator_id: subAccount,
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

  async createPm(id: string, fileUrl: string, subAccount: any) {
    const accountUpdate = await this.prisma.accounts.update({
      where: {
        account_id: id,
        creator_id: subAccount,
      },
      data: {
        account_is_active: true,
        account_blob_storage_url: fileUrl,
      },
    });

    const responseItem = {
      message: 'Account activated',
      account: accountUpdate,
    };
    return responseItem;
  }
}
