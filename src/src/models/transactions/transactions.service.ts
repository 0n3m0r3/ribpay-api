import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { postOrder } from 'src/lib/oxlin';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from '../dto/pagination.dto';
import { PaginationResponseDto } from '../dto/pagination-response.dto';
import {
  ResponseListTransactionDto,
  TransactionResponseDto,
} from './dto/response-transaction.dto';
import { TransactionListQueryDto } from './dto/query-list-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(createTransactionDto: CreateTransactionDto, subAccount: string) {
    const account = await this.prisma.accounts.findUnique({
      where: {
        account_id: createTransactionDto.account_id,
        creator_id: subAccount,
      },
    });

    if (!account) {
      throw new NotFoundException('Account does not exist');
    }

    if (account.account_deletion_date) {
      throw new NotFoundException('Account has been deleted');
    }

    if (account.account_is_active === false) {
      throw new NotFoundException('Account is not active');
    }

    const terminal = await this.prisma.terminals.findUnique({
      where: {
        terminal_id: createTransactionDto.terminal_id,
        creator_id: subAccount,
      },
    });

    if (!terminal) {
      throw new NotFoundException('Terminal does not exist');
    }

    const contract = await this.prisma.contracts.findUnique({
      where: {
        contract_id: createTransactionDto.contract_id,
        creator_id: subAccount,
      },
    });

    if (!contract) {
      throw new NotFoundException('Contract does not exist');
    }

    if (createTransactionDto.currency !== 'EUR' && createTransactionDto.currency !==  null) {
      throw new UnprocessableEntityException('Currency not supported');
    }

    const order = await postOrder({
      amount: createTransactionDto.amount_calculated,
      currency: 'EUR',
      label: createTransactionDto.label,
      instantPayment: createTransactionDto.instant_payment,
      alias_id: contract.contract_alias_id,
      name: account.account_name,
      redirect_url: createTransactionDto.redirect_url,
    });

    return await this.prisma.transactions.create({
      data: {
        transaction_id_oxlin: order.id,
        transaction_status: 'NEW',
        transaction_instant_payment: createTransactionDto.instant_payment,
        transaction_amount_without_vat: Math.floor(
          createTransactionDto.amount_cents -
            createTransactionDto.amount_cents * 0.2,
        ),
        transaction_amount_cents: createTransactionDto.amount_cents,
        transaction_currency: 'EUR',
        transaction_vat: 20,
        transaction_label: createTransactionDto.label,
        transaction_auth_url: `https://www.ribpay.page/authorize/${order.id}`,
        transaction_redirect_url: createTransactionDto.redirect_url,
        transaction_notification_url: createTransactionDto.notification_url,
        account_id: createTransactionDto.account_id,
        terminal_id: createTransactionDto.terminal_id,
        contract_id: createTransactionDto.contract_id,
        creator_id: subAccount,
      },
    });
  }

  async findAll(
    subAccount: string,
    query: TransactionListQueryDto,
    baseUrl: string,
  ): Promise<ResponseListTransactionDto> {
    const { page = 1, per_page = 10 } = query;
    const skip = (page - 1) * per_page;
    const take = per_page;

    const whereClause: any = {
      creator_id: subAccount,
      ...(query.search && {
        OR: [
          {
            transaction_id_oxlin: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
          {
            transaction_label: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
        ],
      }),
      ...(query.transaction_status && {
        transaction_status: query.transaction_status,
      }),
      ...(query.transaction_instant_payment !== undefined && {
        transaction_instant_payment: query.transaction_instant_payment,
      }),
      ...(query.transaction_currency && {
        transaction_currency: query.transaction_currency,
      }),
      ...(query.transaction_amount_cents && {
        transaction_amount_cents: query.transaction_amount_cents,
      }),
      ...(query.transaction_vat && { transaction_vat: query.transaction_vat }),
      ...(query.created_before && {
        transaction_initiated: { lt: new Date(query.created_before) },
      }),
      ...(query.created_after && {
        transaction_initiated: { gt: new Date(query.created_after) },
      }),
      ...(query.last_modified_before && {
        transaction_last_modified: { lt: new Date(query.last_modified_before) },
      }),
      ...(query.last_modified_after && {
        transaction_last_modified: { gt: new Date(query.last_modified_after) },
      }),
      ...(query.transaction_finished_before && {
        transaction_finished: {
          lt: new Date(query.transaction_finished_before),
        },
      }),
      ...(query.transaction_finished_after && {
        transaction_finished: {
          gt: new Date(query.transaction_finished_after),
        },
      }),
    };

    const [transactions, total_count] = await this.prisma.$transaction([
      this.prisma.transactions.findMany({
        where: whereClause,
        skip,
        take,
      }),
      this.prisma.transactions.count({ where: whereClause }),
    ]);

    if (!transactions) {
      throw new NotFoundException('Transactions not found');
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
          ? `${baseUrl}/transactions?page=${page + 1}&per_page=${per_page}`
          : null,
      prev_link:
        page > 1
          ? `${baseUrl}/transactions?page=${page - 1}&per_page=${per_page}`
          : null,
    };

    const result = transactions.map((transaction) => ({
      transaction_id: transaction.transaction_id,
      transaction_last_modified: transaction.transaction_last_modified,
      transaction_id_oxlin: transaction.transaction_id_oxlin,
      transaction_status: transaction.transaction_status,
      transaction_instant_payment: transaction.transaction_instant_payment,
      transaction_amount_without_vat:
        transaction.transaction_amount_without_vat,
      transaction_amount_cents: transaction.transaction_amount_cents,
      transaction_currency: transaction.transaction_currency,
      transaction_vat: transaction.transaction_vat,
      transaction_label: transaction.transaction_label,
      transaction_auth_url: transaction.transaction_auth_url,
      transaction_redirect_url: transaction.transaction_redirect_url,
      transaction_notification_url: transaction.transaction_notification_url,
      transaction_initiated: transaction.transaction_initiated,
      transaction_finished: transaction.transaction_finished,
      account_id: transaction.account_id,
      contract_id: transaction.contract_id,
      terminal_id: transaction.terminal_id,
      installment_id: transaction.installment_id,
      creator_id: transaction.creator_id,
    }));

    return {
      Transactions: result,
      Pagination: pagination,
    } as ResponseListTransactionDto;
  }

  async findOne(id: string, subAccount: string) {
    const transaction = await this.prisma.transactions.findUnique({
      where: { transaction_id: id, creator_id: subAccount },
    });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }

  async findByAccount(
    accountId: string,
    subAccount: string,
    query: TransactionListQueryDto,
    baseUrl: string,
  ): Promise<ResponseListTransactionDto> {
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
          {
            transaction_id_oxlin: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
          {
            transaction_label: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
        ],
      }),
      ...(query.transaction_status && {
        transaction_status: query.transaction_status,
      }),
      ...(query.transaction_instant_payment !== undefined && {
        transaction_instant_payment: query.transaction_instant_payment,
      }),
      ...(query.transaction_currency && {
        transaction_currency: query.transaction_currency,
      }),
      ...(query.transaction_amount_cents && {
        transaction_amount_cents: query.transaction_amount_cents,
      }),
      ...(query.transaction_vat && { transaction_vat: query.transaction_vat }),
      ...(query.created_before && {
        transaction_created_at: { lt: new Date(query.created_before) },
      }),
      ...(query.created_after && {
        transaction_created_at: { gt: new Date(query.created_after) },
      }),
      ...(query.last_modified_before && {
        transaction_last_modified: { lt: new Date(query.last_modified_before) },
      }),
      ...(query.last_modified_after && {
        transaction_last_modified: { gt: new Date(query.last_modified_after) },
      }),     
      ...(query.transaction_finished_before && {
        transaction_finished: {
          lt: new Date(query.transaction_finished_before),
        },
      }),
      ...(query.transaction_finished_after && {
        transaction_finished: {
          gt: new Date(query.transaction_finished_after),
        },
      }),
    };

    const [transactions, total_count] = await this.prisma.$transaction([
      this.prisma.transactions.findMany({
        where: whereClause,
        skip,
        take,
      }),
      this.prisma.transactions.count({ where: whereClause }),
    ]);

    if (!transactions) {
      throw new NotFoundException('Transactions not found');
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
          ? `${baseUrl}/transactions/account/${accountId}?page=${page + 1}&per_page=${per_page}`
          : null,
      prev_link:
        page > 1
          ? `${baseUrl}/transactions/account/${accountId}?page=${page - 1}&per_page=${per_page}`
          : null,
    };

    const result = transactions.map((transaction) => ({
      transaction_id: transaction.transaction_id,
      transaction_last_modified: transaction.transaction_last_modified,
      transaction_id_oxlin: transaction.transaction_id_oxlin,
      transaction_status: transaction.transaction_status,
      transaction_instant_payment: transaction.transaction_instant_payment,
      transaction_amount_without_vat:
        transaction.transaction_amount_without_vat,
      transaction_amount_cents: transaction.transaction_amount_cents,
      transaction_currency: transaction.transaction_currency,
      transaction_vat: transaction.transaction_vat,
      transaction_label: transaction.transaction_label,
      transaction_auth_url: transaction.transaction_auth_url,
      transaction_redirect_url: transaction.transaction_redirect_url,
      transaction_notification_url: transaction.transaction_notification_url,
      transaction_initiated: transaction.transaction_initiated,
      transaction_finished: transaction.transaction_finished,
      account_id: transaction.account_id,
      contract_id: transaction.contract_id,
      terminal_id: transaction.terminal_id,
      installment_id: transaction.installment_id,
      creator_id: transaction.creator_id,
    }));

    return {
      Transactions: result,
      Pagination: pagination,
    } as ResponseListTransactionDto;
  }

  async findByTerminal(
    terminalId: string,
    subAccount: string,
    query: TransactionListQueryDto,
    baseUrl: string,
  ): Promise<ResponseListTransactionDto> {
    const { page = 1, per_page = 10 } = query;
    const skip = (page - 1) * per_page;
    const take = per_page;

    const terminal = await this.prisma.terminals.findUnique({
      where: { terminal_id: terminalId, creator_id: subAccount },
    });

    if (!terminal) {
      throw new NotFoundException('Terminal does not exist');
    }

    const whereClause: any = {
      creator_id: subAccount,
      terminal_id: terminalId,
      ...(query.search && {
        OR: [
          {
            transaction_id_oxlin: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
          {
            transaction_label: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
        ],
      }),
      ...(query.transaction_status && {
        transaction_status: query.transaction_status,
      }),
      ...(query.transaction_instant_payment !== undefined && {
        transaction_instant_payment: query.transaction_instant_payment,
      }),
      ...(query.transaction_currency && {
        transaction_currency: query.transaction_currency,
      }),
      ...(query.transaction_amount_cents && {
        transaction_amount_cents: query.transaction_amount_cents,
      }),
      ...(query.transaction_vat && { transaction_vat: query.transaction_vat }),
      ...(query.created_before && {
        transaction_created_at: { lt: new Date(query.created_before) },
      }),
      ...(query.created_after && {
        transaction_created_at: { gt: new Date(query.created_after) },
      }),
      ...(query.last_modified_before && {
        transaction_last_modified: { lt: new Date(query.last_modified_before) },
      }),
      ...(query.last_modified_after && {
        transaction_last_modified: { gt: new Date(query.last_modified_after) },
      }),
      ...(query.transaction_finished_before && {
        transaction_finished: {
          lt: new Date(query.transaction_finished_before),
        },
      }),
      ...(query.transaction_finished_after && {
        transaction_finished: {
          gt: new Date(query.transaction_finished_after),
        },
      }),
    };

    const [transactions, total_count] = await this.prisma.$transaction([
      this.prisma.transactions.findMany({
        where: whereClause,
        skip,
        take,
      }),
      this.prisma.transactions.count({ where: whereClause }),
    ]);

    if (!transactions) {
      throw new NotFoundException('Transactions not found');
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
          ? `${baseUrl}/transactions/terminal/${terminalId}?page=${page + 1}&per_page=${per_page}`
          : null,
      prev_link:
        page > 1
          ? `${baseUrl}/transactions/terminal/${terminalId}?page=${page - 1}&per_page=${per_page}`
          : null,
    };

    const result = transactions.map((transaction) => ({
      transaction_id: transaction.transaction_id,
      transaction_last_modified: transaction.transaction_last_modified,
      transaction_id_oxlin: transaction.transaction_id_oxlin,
      transaction_status: transaction.transaction_status,
      transaction_instant_payment: transaction.transaction_instant_payment,
      transaction_amount_without_vat:
        transaction.transaction_amount_without_vat,
      transaction_amount_cents: transaction.transaction_amount_cents,
      transaction_currency: transaction.transaction_currency,
      transaction_vat: transaction.transaction_vat,
      transaction_label: transaction.transaction_label,
      transaction_auth_url: transaction.transaction_auth_url,
      transaction_redirect_url: transaction.transaction_redirect_url,
      transaction_notification_url: transaction.transaction_notification_url,
      transaction_initiated: transaction.transaction_initiated,
      transaction_finished: transaction.transaction_finished,
      account_id: transaction.account_id,
      contract_id: transaction.contract_id,
      terminal_id: transaction.terminal_id,
      installment_id: transaction.installment_id,
      creator_id: transaction.creator_id,
    }));

    return {
      Transactions: result,
      Pagination: pagination,
    } as ResponseListTransactionDto;
  }
}