import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import {
  UpdateUserDto,
  AddUserToAccountDto,
  RemoveUserFromAccountDto,
} from './dto/update-user.dto';

import { PrismaService } from './../../prisma/prisma.service';
import { ResponseListUserDto } from './dto/response-user.dto';
import { PaginationResponseDto } from '../dto/pagination-response.dto';
import { UserListQueryDto } from './dto/query-list-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto, subAccount: string) {
    // Verify that the account exists
    const account = await this.prisma.accounts.findUnique({
      where: {
        account_id: createUserDto.account_id,
        creator_id: subAccount,
      },
    });

    if (!account) {
      throw new BadRequestException('Account does not exist');
    }
    if (account.account_deletion_date) {
      throw new BadRequestException('Account has been deleted');
    }
    if (account.account_is_active === false) {
      throw new BadRequestException('Account is not active');
    }

    const user = await this.prisma.users.create({
      data: {
        user_first_name: createUserDto?.first_name,
        user_last_name: createUserDto?.last_name,
        user_email: createUserDto?.email,
        user_phone: createUserDto?.phone,
        creator_id: subAccount,
      },
    });

    await this.prisma.user_has_accounts.create({
      data: {
        user_id: user.user_id,
        account_id: createUserDto.account_id,
        user_role: 'user',
      },
    });

    const result = {
      ...user,
      user_role: 'user',
    };

    return result;
  }

  async findAll(
    subAccount: string,
    query: UserListQueryDto,
    baseUrl: string,
  ): Promise<ResponseListUserDto> {
    const { page = 1, per_page = 10 } = query;
    const skip = (page - 1) * per_page;
    const take = per_page;

    const whereClause: any = {
      creator_id: subAccount,
      ...(query.search && {
        OR: [
          {
            user_first_name: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
          {
            user_last_name: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
          {
            user_email: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
          {
            user_phone: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
          {
            user_birth_city: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
          {
            user_birth_country: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          }
        ],
      }),
      ...(query.last_modified_before && {
        user_last_modified: { lt: new Date(query.last_modified_before) },
      }),
      ...(query.last_modified_after && {
        user_last_modified: { gt: new Date(query.last_modified_after) },
      }),
    };

    const [users, total_count] = await this.prisma.$transaction([
      this.prisma.users.findMany({
        where: whereClause,
        skip,
        take,
        include: {
          user_has_accounts: {
            select: { user_role: true },
          },
        },
      }),
      this.prisma.users.count({ where: whereClause }),
    ]);

    if (!users) {
      throw new NotFoundException('Users not found');
    }

    const total_pages = Math.ceil(total_count / per_page);

    const pagination: PaginationResponseDto = {
      current_page: page,
      next_page: page < total_pages ? page + 1 : null,
      prev_page: page > 1 ? page - 1 : null,
      per_page,
      total_pages,
      total_count,
      next_link:
        page < total_pages
          ? `${baseUrl}/users?page=${page + 1}&per_page=${per_page}`
          : null,
      prev_link:
        page > 1
          ? `${baseUrl}/users?page=${page - 1}&per_page=${per_page}`
          : null,
    };

    const result = users.map((user) => ({
      user_id: user.user_id,
      user_last_modified: user.user_last_modified,
      user_first_name: user.user_first_name,
      user_last_name: user.user_last_name,
      user_birth_date: user.user_birth_date,
      user_birth_city: user.user_birth_city,
      user_birth_country: user.user_birth_country,
      user_phone: user.user_phone,
      user_email: user.user_email,
      creator_id: user.creator_id,
      // user_role: user.user_has_accounts?.[0]?.user_role,
    }));

    return {
      Users: result,
      Pagination: pagination,
    } as unknown as ResponseListUserDto;
  }

  async findOne(id: string, subAccount: string) {
    const user = await this.prisma.users.findUnique({
      where: { user_id: id, creator_id: subAccount },
      include: {
        user_has_accounts: {
          select: { account_id: true, user_role: true },
        },
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const result = {
      user_id: user.user_id,
      user_last_modified: user.user_last_modified,
      user_first_name: user.user_first_name,
      user_last_name: user.user_last_name,
      user_birth_date: user.user_birth_date,
      user_birth_city: user.user_birth_city,
      user_birth_country: user.user_birth_country,
      user_phone: user.user_phone,
      user_email: user.user_email,
      creator_id: user.creator_id,
      accounts: user.user_has_accounts.map((account) => ({
        account_id: account.account_id,
        user_role: account.user_role,
      })),
    };
    return result;
  }

  async findByAccountId(
    id: string,
    subAccount: string,
    query: UserListQueryDto,
    baseUrl: string,
  ): Promise<ResponseListUserDto> {
    const { page = 1, per_page = 10 } = query;
    const skip = (page - 1) * per_page;
    const take = per_page;

    const account = await this.prisma.accounts.findUnique({
      where: {
        account_id: id,
        creator_id: subAccount,
      },
    });

    if (!account) {
      throw new NotFoundException('Account does not exist');
    }

    const whereClause: any = {
      creator_id: subAccount,
      user_has_accounts: { some: { account_id: id } },
      ...(query.search && {
        OR: [
          {
            user_first_name: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
          {
            user_last_name: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
          {
            user_email: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
          {
            user_phone: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
          {
            user_birth_city: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
          {
            user_birth_country: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
        ],
      }),
      ...(query.last_modified_before && {
        user_last_modified: { lt: new Date(query.last_modified_before) },
      }),
      ...(query.last_modified_after && {
        user_last_modified: { gt: new Date(query.last_modified_after) },
      }),
    };

    const [users, total_count] = await this.prisma.$transaction([
      this.prisma.users.findMany({
        where: whereClause,
        skip,
        take,
        include: {
          user_has_accounts: {
            where: { account_id: id },
            select: { user_role: true },
          },
        },
      }),
      this.prisma.users.count({ where: whereClause }),
    ]);

    if (!users) {
      throw new NotFoundException('Users not found');
    }

    const total_pages = Math.ceil(total_count / per_page);

    const pagination: PaginationResponseDto = {
      current_page: page,
      next_page: page < total_pages ? page + 1 : null,
      prev_page: page > 1 ? page - 1 : null,
      per_page,
      total_pages,
      total_count,
      next_link:
        page < total_pages
          ? `${baseUrl}/users?page=${page + 1}&per_page=${per_page}`
          : null,
      prev_link:
        page > 1
          ? `${baseUrl}/users?page=${page - 1}&per_page=${per_page}`
          : null,
    };

    const result = users.map((user) => ({
      user_id: user.user_id,
      user_last_modified: user.user_last_modified,
      user_first_name: user.user_first_name,
      user_last_name: user.user_last_name,
      user_birth_date: user.user_birth_date,
      user_birth_city: user.user_birth_city,
      user_birth_country: user.user_birth_country,
      user_phone: user.user_phone,
      user_email: user.user_email,
      creator_id: user.creator_id,
      // user_role: user.user_has_accounts?.[0]?.user_role,
    }));

    return {
      Users: result,
      Pagination: pagination,
    } as unknown as ResponseListUserDto;
  }
  async update(id: string, updateUserDto: UpdateUserDto, subAccount: string) {
    const user = await this.prisma.users.findUnique({
      where: { user_id: id, creator_id: subAccount },
      include: {
        user_has_accounts: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const response = await this.prisma.users.update({
      where: { user_id: id, creator_id: subAccount },
      data: {
        user_first_name: updateUserDto?.first_name,
        user_last_name: updateUserDto?.last_name,
        user_birth_date: updateUserDto?.birth_date,
        user_birth_city: updateUserDto?.birth_city,
        user_birth_country: updateUserDto?.birth_country,
        user_last_modified: new Date(),
        user_phone: updateUserDto?.phone,
        user_email: updateUserDto?.email,
      },
    });

    return {
      ...response,
      user_role: user.user_has_accounts?.[0]?.user_role,
    };
  }

  async addUserToAccount(
    id: string,
    addUserToAccountDto: AddUserToAccountDto,
    subAccount: string,
  ) {
    const user = await this.prisma.users.findUnique({
      where: { user_id: id, creator_id: subAccount },
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const account = await this.prisma.accounts.findUnique({
      where: {
        account_id: addUserToAccountDto.account_id,
        creator_id: subAccount,
      },
    });

    if (!account) {
      throw new NotFoundException('Account does not exist');
    }
    if (account.account_deletion_date) {
      throw new BadRequestException('Account has been deleted');
    }

    const relation = await this.prisma.user_has_accounts.findFirst({
      where: {
        user_id: id,
        account_id: addUserToAccountDto.account_id,
      },
    });

    if (relation) {
      throw new BadRequestException('User already added to account');
    }

    return await this.prisma.user_has_accounts.create({
      data: {
        user_id: id,
        account_id: addUserToAccountDto.account_id,
        user_role: 'user',
      },
    });
  }

  async removeUserFromAccount(
    id: string,
    removeUserFromAccountDto: RemoveUserFromAccountDto,
    subAccount: string,
  ) {
    const user = await this.prisma.users.findUnique({
      where: { user_id: id, creator_id: subAccount },
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const account = await this.prisma.accounts.findUnique({
      where: {
        account_id: removeUserFromAccountDto.account_id,
        creator_id: subAccount,
      },
    });

    if (!account) {
      throw new NotFoundException('Account does not exist');
    }

    // Verify that the user/account relation is not 'admin'
    const adminRelation = await this.prisma.user_has_accounts.findFirst({
      where: {
        user_id: id,
        account_id: removeUserFromAccountDto.account_id,
        user_role: 'admin',
      },
    });

    if (adminRelation) {
      throw new BadRequestException('User is the admin of the account');
    }

    const relation = await this.prisma.user_has_accounts.findFirst({
      where: {
        user_id: id,
        account_id: removeUserFromAccountDto.account_id,
      },
    });

    if (!relation) {
      throw new BadRequestException('User not added to account');
    }

    return await this.prisma.user_has_accounts.delete({
      where: {
        user_id_account_id: {
          user_id: id,
          account_id: removeUserFromAccountDto.account_id,
        },
      },
    });
  }

  async remove(id: string, subAccount: string) {
    const user = await this.prisma.users.findUnique({
      where: { user_id: id, creator_id: subAccount },
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    // Search for associated account with role admin where the account is not deleted
    const account = await this.prisma.user_has_accounts.findFirst({
      where: {
        user_id: id,
        user_role: 'admin',
        accounts: { account_deletion_date: null },
      },
    });

    if (account) {
      throw new BadRequestException(
        'User cannot be deleted because they are the admin of an account',
      );
    }

    await this.prisma.user_has_accounts.deleteMany({
      where: { user_id: id },
    });

    const deletedUser = await this.prisma.users.delete({
      where: { user_id: id, creator_id: subAccount },
    });
  }
}
