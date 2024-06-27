import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTerminalDto } from './dto/create-terminal.dto';
import { UpdateTerminalDto } from './dto/update-terminal.dto';
import { randomUUID } from 'crypto';
import { Client } from 'lago-javascript-client';
import { PaginationResponseDto } from '../dto/pagination-response.dto';
import { TerminalListQueryDto } from './dto/query-list-terminal.dto';
import { TerminalListDto } from './dto/response-terminal.dto';

@Injectable()
export class TerminalsService {
  constructor(private prisma: PrismaService) {}

  async create(createTerminalDto: CreateTerminalDto, subAccount: string) {
    const client = Client(process.env.LAGO_API_KEY);
    // Validate that the account exists
    const account = await this.prisma.accounts.findUnique({
      where: {
        account_id: createTerminalDto.account_id,
        creator_id: subAccount,
      },
    });

    if (!account) {
      throw new NotFoundException('Account does not exist');
    }

    if (account.account_is_active === false) {
      throw new NotFoundException('Account is not active');
    }

    if (account.account_deletion_date) {
      throw new NotFoundException('Account has been deleted');
    }

    const subscriptionId = randomUUID();
    // https://stackoverflow.com/a/34053802
    const creationDate = new Date().toISOString().split('.')[0] + 'Z';

    const subscriptionObject = {
      external_customer_id: account.account_id,
      plan_code: createTerminalDto.subscription_type ?? 'payments',
      external_id: subscriptionId,
      subscription_at: creationDate,
      billing_time: 'calendar',
    };

    const {
      data: { subscription },
    } = await client.subscriptions.createSubscription({
      subscription: {
        ...subscriptionObject,
        billing_time: 'calendar',
      },
    });

    return await this.prisma.terminals.create({
      data: {
        terminal_label: createTerminalDto?.label || 'New Terminal',
        terminal_favorite_contract_type:
          createTerminalDto?.favorite_contract_type || 'RIBPAY',
        terminal_subscription_id: subscriptionId,
        terminal_subscription_type:
          createTerminalDto?.subscription_type ?? 'payments',
        account_id: createTerminalDto.account_id,
        creator_id: subAccount,
      },
    });
  }

  async findAll(subAccount: string, query: TerminalListQueryDto, baseUrl: string): Promise<TerminalListDto> {
    const { page = 1, per_page = 10 } = query;
    const skip = (page - 1) * per_page;
    const take = per_page;

    const whereClause: any = {
      creator_id: subAccount,
      ...(query.search && {
        OR: [
          { terminal_label: { contains: query.search, mode: 'insensitive' as const } },
          { terminal_favorite_contract_type: { contains: query.search, mode: 'insensitive' as const } },
          { terminal_subscription_id: { contains: query.search, mode: 'insensitive' as const } },
        ],
      }),
      ...(query.terminal_subscription_type && { terminal_subscription_type: query.terminal_subscription_type }),
      ...(query.created_before && { terminal_created_at: { lt: new Date(query.created_before) } }),
      ...(query.created_after && { terminal_created_at: { gt: new Date(query.created_after) } }),
      ...(query.last_modified_before && { terminal_last_modified: { lt: new Date(query.last_modified_before) } }),
      ...(query.last_modified_after && { terminal_last_modified: { gt: new Date(query.last_modified_after) } }),
    };

    const [terminals, total_count] = await this.prisma.$transaction([
      this.prisma.terminals.findMany({
        where: whereClause,
        skip,
        take,
      }),
      this.prisma.terminals.count({ where: whereClause }),
    ]);

    if (!terminals) {
      throw new NotFoundException('Terminals not found');
    }

    const total_pages = Math.ceil(total_count / per_page);

    const pagination: PaginationResponseDto = {
      current_page: page,
      next_page: page < total_pages ? page + 1 : null,
      prev_page: page > 1 ? page - 1 : null,
      per_page,
      total_pages,
      total_count,
      next_link: page < total_pages ? `${baseUrl}/terminals?page=${page + 1}&per_page=${per_page}` : null,
      prev_link: page > 1 ? `${baseUrl}/terminals?page=${page - 1}&per_page=${per_page}` : null,
    };

    const result = terminals.map((terminal) => ({
      terminal_id: terminal.terminal_id,
      terminal_created_at: terminal.terminal_created_at,
      terminal_last_modified: terminal.terminal_last_modified,
      terminal_label: terminal.terminal_label,
      terminal_favorite_contract_type: terminal.terminal_favorite_contract_type,
      terminal_subscription_id: terminal.terminal_subscription_id,
      terminal_subscription_type: terminal.terminal_subscription_type,
      account_id: terminal.account_id,
      creator_id: terminal.creator_id,
    }));

    return {
      Terminals: result,
      Pagination: pagination,
    } as unknown as TerminalListDto;
  }


  async findOne(id: string, subAccount: string) {
    const terminal = await this.prisma.terminals.findUnique({
      where: { terminal_id: id, creator_id: subAccount },
    });

    if (!terminal) {
      throw new NotFoundException('Terminal not found');
    }

    return await this.prisma.terminals.findUnique({
      where: { terminal_id: id, creator_id: subAccount },
    });
  }

  async findByAccount(accountId: string, subAccount: string, query: TerminalListQueryDto, baseUrl: string): Promise<TerminalListDto> {
    const { page = 1, per_page = 10 } = query;
    const skip = (page - 1) * per_page;
    const take = per_page;

    const account = await this.prisma.accounts.findUnique({
      where: { account_id: accountId, creator_id: subAccount },
    });

    if (!account) {
      throw new NotFoundException('Account does not exist');
    }

    const whereClause: any = {
      creator_id: subAccount,
      account_id: accountId,
      ...(query.search && {
        OR: [
          { terminal_label: { contains: query.search, mode: 'insensitive' as const } },
          { terminal_favorite_contract_type: { contains: query.search, mode: 'insensitive' as const } },
          { terminal_subscription_id: { contains: query.search, mode: 'insensitive' as const } },
        ],
      }),
      ...(query.terminal_subscription_type && { terminal_subscription_type: query.terminal_subscription_type }),
      ...(query.created_before && { terminal_created_at: { lt: new Date(query.created_before) } }),
      ...(query.created_after && { terminal_created_at: { gt: new Date(query.created_after) } }),
      ...(query.last_modified_before && { terminal_last_modified: { lt: new Date(query.last_modified_before) } }),
      ...(query.last_modified_after && { terminal_last_modified: { gt: new Date(query.last_modified_after) } }),
    };

    const [terminals, total_count] = await this.prisma.$transaction([
      this.prisma.terminals.findMany({
        where: whereClause,
        skip,
        take,
      }),
      this.prisma.terminals.count({ where: whereClause }),
    ]);

    if (!terminals) {
      throw new NotFoundException('Terminals not found');
    }

    const total_pages = Math.ceil(total_count / per_page);

    const pagination: PaginationResponseDto = {
      current_page: page,
      next_page: page < total_pages ? page + 1 : null,
      prev_page: page > 1 ? page - 1 : null,
      per_page,
      total_pages,
      total_count,
      next_link: page < total_pages ? `${baseUrl}/terminals/account/${accountId}?page=${page + 1}&per_page=${per_page}` : null,
      prev_link: page > 1 ? `${baseUrl}/terminals/account/${accountId}?page=${page - 1}&per_page=${per_page}` : null,
    };

    const result = terminals.map((terminal) => ({
      terminal_id: terminal.terminal_id,
      terminal_created_at: terminal.terminal_created_at,
      terminal_last_modified: terminal.terminal_last_modified,
      terminal_label: terminal.terminal_label,
      terminal_favorite_contract_type: terminal.terminal_favorite_contract_type,
      terminal_subscription_id: terminal.terminal_subscription_id,
      terminal_subscription_type: terminal.terminal_subscription_type,
      account_id: terminal.account_id,
      creator_id: terminal.creator_id,
    }));

    return {
      Terminals: result,
      Pagination: pagination,
    } as unknown as TerminalListDto;
  }

  async update(
    id: string,
    updateTerminalDto: UpdateTerminalDto,
    subAccount: string,
  ) {
    const terminal = await this.prisma.terminals.findUnique({
      where: { terminal_id: id, creator_id: subAccount },
    });

    if (!terminal) {
      throw new NotFoundException('Terminal not found');
    }

    return await this.prisma.terminals.update({
      where: { terminal_id: id, creator_id: subAccount },
      data: {
        terminal_label: updateTerminalDto?.label,
        terminal_favorite_contract_type:
          updateTerminalDto?.favorite_contract_type,
      },
    });
  }

  async remove(id: string, subAccount: string) {
    const terminal = await this.prisma.terminals.findUnique({
      where: { terminal_id: id, creator_id: subAccount },
    });

    if (!terminal) {
      throw new NotFoundException('Terminal does not exist');
    }
    return await this.prisma.terminals.delete({
      where: { terminal_id: id, creator_id: subAccount },
    });
  }
}
