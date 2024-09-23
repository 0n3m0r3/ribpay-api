import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationResponseDto } from '../../dto/pagination-response.dto';
import { ContractListQueryDto } from './dto/query-list-contract.dto';
import { ContractListResponseDto } from './dto/response-contract.dto';

@Injectable()
export class ContractsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    query: ContractListQueryDto,
    baseUrl: string,
  ): Promise<ContractListResponseDto> {
    const { page = 1, per_page = 10 } = query;
    const skip = (page - 1) * per_page;
    const take = per_page;

    const whereClause: any = {
      ...(query.search && {
        OR: [
          {
            contract_type: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
          {
            contract_number: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
          {
            contract_beneficiary_name: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
          {
            contract_merchant_id: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
          {
            contract_alias_id: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
        ],
      }),
      ...(query.contract_type && { contract_type: query.contract_type }),
      ...(query.created_before && {
        contract_created_at: { lt: new Date(query.created_before) },
      }),
      ...(query.created_after && {
        contract_created_at: { gt: new Date(query.created_after) },
      }),
      ...(query.last_modified_before && {
        contract_last_modified: { lt: new Date(query.last_modified_before) },
      }),
      ...(query.last_modified_after && {
        contract_last_modified: { gt: new Date(query.last_modified_after) },
      }),
      ...(query.is_deleted === true && {
        contract_deleted_at: { not: null },
      }),
      ...(query.is_deleted === false && { contract_deleted_at: null }),
    };

    const [contracts, total_count] = await this.prisma.$transaction([
      this.prisma.contracts.findMany({
        where: whereClause,
        skip,
        take,
      }),
      this.prisma.contracts.count({ where: whereClause }),
    ]);

    if (!contracts) {
      throw new NotFoundException('Contracts not found');
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
          ? `${baseUrl}/contracts?page=${page + 1}&per_page=${per_page}`
          : null,
      prev_link:
        page > 1
          ? `${baseUrl}/contracts?page=${page - 1}&per_page=${per_page}`
          : null,
    };

    const result = contracts.map((contract) => ({
      contract_id: contract.contract_id,
      contract_created_at: contract.contract_created_at,
      contract_last_modified: contract.contract_last_modified,
      contract_deleted_at: contract.contract_deleted_at,
      contract_type: contract.contract_type,
      contract_number: contract.contract_number,
      contract_beneficiary_name: contract.contract_beneficiary_name,
      contract_merchant_id: contract.contract_merchant_id,
      contract_alias_id: contract.contract_alias_id,
      terminal_id: contract.terminal_id,
      account_id: contract.account_id,
      creator_id: contract.creator_id,
    }));

    return {
      Contracts: result,
      Pagination: pagination,
    } as ContractListResponseDto;
  }

  async findOne(id: string) {
    const contract = await this.prisma.contracts.findUnique({
      where: { contract_id: id },
    });
    if (!contract) {
      throw new NotFoundException('Contract not found');
    }
    return contract;
  }

  async findByTerminal(
    terminalId: string,
    query: ContractListQueryDto,
    baseUrl: string,
  ): Promise<ContractListResponseDto> {
    const { page = 1, per_page = 10 } = query;
    const skip = (page - 1) * per_page;
    const take = per_page;

    const terminal = await this.prisma.terminals.findUnique({
      where: { terminal_id: terminalId },
    });

    if (!terminal) {
      throw new NotFoundException('Terminal does not exist');
    }

    const whereClause: any = {
      terminal_id: terminalId,
      ...(query.search && {
        OR: [
          {
            contract_type: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
          {
            contract_number: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
          {
            contract_beneficiary_name: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
          {
            contract_merchant_id: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
          {
            contract_alias_id: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
        ],
      }),
      ...(query.contract_type && { contract_type: query.contract_type }),
      ...(query.created_before && {
        contract_created_at: { lt: new Date(query.created_before) },
      }),
      ...(query.created_after && {
        contract_created_at: { gt: new Date(query.created_after) },
      }),
      ...(query.last_modified_before && {
        contract_last_modified: { lt: new Date(query.last_modified_before) },
      }),
      ...(query.last_modified_after && {
        contract_last_modified: { gt: new Date(query.last_modified_after) },
      }),
      ...(query.is_deleted === true && {
        contract_deleted_at: { not: null },
      }),
      ...(query.is_deleted === false && { contract_deleted_at: null }),
    };

    const [contracts, total_count] = await this.prisma.$transaction([
      this.prisma.contracts.findMany({
        where: whereClause,
        skip,
        take,
      }),
      this.prisma.contracts.count({ where: whereClause }),
    ]);

    if (!contracts) {
      throw new NotFoundException('Contracts not found');
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
          ? `${baseUrl}/contracts/terminal/${terminalId}?page=${page + 1}&per_page=${per_page}`
          : null,
      prev_link:
        page > 1
          ? `${baseUrl}/contracts/terminal/${terminalId}?page=${page - 1}&per_page=${per_page}`
          : null,
    };

    const result = contracts.map((contract) => ({
      contract_id: contract.contract_id,
      contract_created_at: contract.contract_created_at,
      contract_last_modified: contract.contract_last_modified,
      contract_deleted_at: contract.contract_deleted_at,
      contract_type: contract.contract_type,
      contract_number: contract.contract_number,
      contract_beneficiary_name: contract.contract_beneficiary_name,
      contract_merchant_id: contract.contract_merchant_id,
      contract_alias_id: contract.contract_alias_id,
      terminal_id: contract.terminal_id,
      account_id: contract.account_id,
      creator_id: contract.creator_id,
    }));

    return {
      Contracts: result,
      Pagination: pagination,
    } as ContractListResponseDto;
  }

  async findByAccount(
    accountId: string,
    query: ContractListQueryDto,
    baseUrl: string,
  ): Promise<ContractListResponseDto> {
    const { page = 1, per_page = 10 } = query;
    const skip = (page - 1) * per_page;
    const take = per_page;

    const account = await this.prisma.accounts.findUnique({
      where: { account_id: accountId },
    });

    if (!account) {
      throw new NotFoundException('Account does not exist');
    }

    const whereClause: any = {
      account_id: accountId,
      ...(query.search && {
        OR: [
          {
            contract_type: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
          {
            contract_number: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
          {
            contract_beneficiary_name: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
          {
            contract_merchant_id: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
          {
            contract_alias_id: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
        ],
      }),
      ...(query.contract_type && { contract_type: query.contract_type }),
      ...(query.created_before && {
        contract_created_at: { lt: new Date(query.created_before) },
      }),
      ...(query.created_after && {
        contract_created_at: { gt: new Date(query.created_after) },
      }),
      ...(query.last_modified_before && {
        contract_last_modified: { lt: new Date(query.last_modified_before) },
      }),
      ...(query.last_modified_after && {
        contract_last_modified: { gt: new Date(query.last_modified_after) },
      }),
      ...(query.is_deleted === true && {
        contract_deleted_at: { not: null },
      }),
      ...(query.is_deleted === false && { contract_deleted_at: null }),
    };

    const [contracts, total_count] = await this.prisma.$transaction([
      this.prisma.contracts.findMany({
        where: whereClause,
        skip,
        take,
      }),
      this.prisma.contracts.count({ where: whereClause }),
    ]);

    if (!contracts) {
      throw new NotFoundException('Contracts not found');
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
          ? `${baseUrl}/contracts/account/${accountId}?page=${page + 1}&per_page=${per_page}`
          : null,
      prev_link:
        page > 1
          ? `${baseUrl}/contracts/account/${accountId}?page=${page - 1}&per_page=${per_page}`
          : null,
    };

    const result = contracts.map((contract) => ({
      contract_id: contract.contract_id,
      contract_created_at: contract.contract_created_at,
      contract_last_modified: contract.contract_last_modified,
      contract_deleted_at: contract.contract_deleted_at,
      contract_type: contract.contract_type,
      contract_number: contract.contract_number,
      contract_beneficiary_name: contract.contract_beneficiary_name,
      contract_merchant_id: contract.contract_merchant_id,
      contract_alias_id: contract.contract_alias_id,
      terminal_id: contract.terminal_id,
      account_id: contract.account_id,
      creator_id: contract.creator_id,
    }));

    return {
      Contracts: result,
      Pagination: pagination,
    } as ContractListResponseDto;
  }



}