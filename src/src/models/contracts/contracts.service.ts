import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  deleteAlias,
  deleteAuthorizedAccount,
  postAlias,
  postAuthorizedAccounts,
  postAuthorizedAccountsPersonnePhysique,
  searchProviders,
} from 'src/lib/oxlin';
import { PrismaService } from 'src/prisma/prisma.service';
import { isDev } from '../../utils/is-dev';
import { generateReference } from '../../utils/uuid-helpers';
import { PaginationResponseDto } from '../dto/pagination-response.dto';
import {
  CreateRIBPayContractDto,
  CreateVADSContractDto,
} from './dto/create-contract.dto';
import { ContractListQueryDto } from './dto/query-list-contract.dto';
import {
  ContractListResponseDto,
  RIBPayContractResponseDto,
  VADSContractResponseDto,
} from './dto/response-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { sendMail } from 'src/utils/mailing/mail';
import { createMonextPDF } from 'src/utils/pdf/monext';

import { MonextPDFInput } from 'src/utils/pdf/monext';


@Injectable()
export class ContractsService {
  constructor(private prisma: PrismaService) {}

  async createRIBPayContracts(
    createContractDto: CreateRIBPayContractDto,
    subAccount: string,
  ) {
    const account = await this.prisma.accounts.findUnique({
      where: {
        account_id: createContractDto.account_id,
        account_deletion_date: null,
        account_is_active: true,
        creator_id: subAccount,
      },
    });

    if (!account) {
      throw new UnprocessableEntityException(
        'Account does not exist, has been deleted or is inactive',
      );
    }
    if (createContractDto?.terminal_id) {
      const terminal = await this.prisma.terminals.findUnique({
        where: {
          terminal_id: createContractDto.terminal_id,
          creator_id: subAccount,
        },
      });

      if (!terminal) {
        throw new NotFoundException('Terminal does not exist');
      }

      const contracts = await this.prisma.contracts.findMany({
        where: {
          terminal_id: createContractDto.terminal_id,
          contract_type: 'RIBPAY',
          creator_id: subAccount,
          contract_deleted_at: null,
        },
      });

      if (contracts.length > 0) {
        throw new ConflictException(
          'Terminal already has a contract of this type',
        );
      }
    }

    const providers = await searchProviders({
      iban: createContractDto.iban,
    });

    const alias = await postAlias({
      user_reference: account.account_id,
      iban: createContractDto.iban,
      label: account.account_name,
      bic: (providers[0] as any).bic,
    });

    if (alias instanceof Error) {
      throw new BadRequestException('Error creating alias');
    }

    let authorizedAccount;

    if (account.account_type === 'personnePhysique') {
      const adminUser = await this.prisma.user_has_accounts.findFirst({
        where: {
          account_id: createContractDto.account_id,
          user_role: 'admin',
        },
        include: {
          users: true,
        },
      });

      if (!adminUser) {
        throw new NotFoundException('Admin user not found');
      }

      if (isDev) {
        authorizedAccount = await postAuthorizedAccounts({
          iban: 'FR8530003000307599775722N09',
          nationalId: '99999999999999',
          company_name: 'MY SANDBOX COMPANY',
          headers: { 'Content-type': 'application/hal+json' },
        });
      } else {
        authorizedAccount = await postAuthorizedAccountsPersonnePhysique({
          firstname: adminUser.users.user_first_name,
          surname: adminUser.users.user_last_name,
          birth_date: adminUser.users.user_birth_date,
          birth_city: adminUser.users.user_birth_city,
          birth_country: adminUser.users.user_birth_country,
          iban: createContractDto.iban,
          company_name: account.account_name,
          headers: { 'Content-type': 'application/json', Accept: '*/*' },
        });
      }
    } else {
      if (isDev) {
        authorizedAccount = await postAuthorizedAccounts({
          iban: 'FR8530003000307599775722N09',
          nationalId: '99999999999999',
          company_name: 'MY SANDBOX COMPANY',
          headers: { 'Content-type': 'application/hal+json' },
        });
      } else {
        authorizedAccount = await postAuthorizedAccounts({
          iban: createContractDto.iban,
          nationalId: account.account_national_id,
          company_name: account.account_name,
          headers: { 'Content-type': 'application/json', Accept: '*/*' },
        });
      }
    }

    if (authorizedAccount instanceof Error) {
      if ((authorizedAccount as any).status === 409) {
        throw new ConflictException(
          (authorizedAccount as any).error.error_description,
        );
      } else {
        console.log(authorizedAccount);
        throw new BadRequestException('Error creating authorized account');
      }
    }
    authorizedAccount = JSON.parse(authorizedAccount);

    const contract_number = generateReference({
      prefix: 'OXLN',
      contractId: authorizedAccount.id,
    });

    const contract = await this.prisma.contracts.create({
      data: {
        contract_type: createContractDto.contract_type,
        contract_merchant_id: authorizedAccount.id,
        account_id: createContractDto.account_id,
        terminal_id: createContractDto?.terminal_id,
        contract_alias_id: alias.id,
        creator_id: subAccount,
        contract_beneficiary_name: account.account_name,
        contract_number,
      },
    });

    return this.toRIBPayContract(contract);
  }

  async createVADSContracts(
    createContractDto: CreateVADSContractDto,
    subAccount: string,
  ) {
    const account = await this.prisma.accounts.findUnique({
      where: {
        account_id: createContractDto.account_id,
        account_deletion_date: null,
        account_is_active: true,
        creator_id: subAccount,
      },
    });

    if (!account) {
      throw new UnprocessableEntityException(
        'Account does not exist, has been deleted or is inactive',
      );
    }

    if (createContractDto?.terminal_id) {
      const terminal = await this.prisma.terminals.findUnique({
        where: {
          terminal_id: createContractDto.terminal_id,
          creator_id: subAccount,
        },
      });

      if (!terminal) {
        throw new NotFoundException('Terminal does not exist');
      }

      const contracts = await this.prisma.contracts.findMany({
        where: {
          terminal_id: createContractDto.terminal_id,
          contract_type: 'VADS',
          creator_id: subAccount,
          contract_deleted_at: null,
        },
      });

      if (contracts.length > 0) {
        throw new ConflictException(
          'Terminal already has a contract of this type',
        );
      }
    }

    const contract_number = `VADS_${createContractDto.contract_merchant_id}`;

    const contract = await this.prisma.contracts.create({
      data: {
        contract_is_active: false,
        contract_type: createContractDto.contract_type,
        contract_merchant_id: createContractDto.contract_merchant_id,
        account_id: createContractDto.account_id,
        terminal_id: createContractDto?.terminal_id,
        creator_id: subAccount,
        contract_beneficiary_name: account.account_name,
        contract_number,
        contract_bank_name: createContractDto.contract_bank_name,
        contract_bank_code: createContractDto.contract_bank_code,
        contract_3d_secure: createContractDto.contract_3d_secure || true,
        contract_max_amount: createContractDto.contract_max_amount || 10000,
      },
    });

    const inputs : MonextPDFInput = {
      beneficiary_name: account.account_name,
      merchant_id: createContractDto.contract_merchant_id,
      secure: createContractDto.contract_3d_secure,
      bank_name: createContractDto.contract_bank_name,
      bank_code: createContractDto.contract_bank_code,
      max_amount: createContractDto.contract_max_amount.toString(),
    };

    createMonextPDF(inputs);

    return this.toVADSContract(contract);
  }

  async findAll(
    subAccount: string,
    query: ContractListQueryDto,
    baseUrl: string,
  ): Promise<ContractListResponseDto> {
    const { page = 1, per_page = 10 } = query;
    const skip = (page - 1) * per_page;
    const take = per_page;

    const whereClause: any = {
      creator_id: subAccount,
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

    const result = contracts.map((contract) =>
      contract.contract_type === 'VADS'
        ? this.toVADSContract(contract)
        : this.toRIBPayContract(contract),
    );

    return {
      Contracts: result,
      Pagination: pagination,
    } as ContractListResponseDto;
  }

  async findOne(id: string, subAccount: string) {
    const contract = await this.prisma.contracts.findUnique({
      where: { contract_id: id, creator_id: subAccount },
    });
    if (!contract) {
      throw new NotFoundException('Contract not found');
    }
    if (contract.contract_type === 'VADS') {
      return this.toVADSContract(contract);
    }
    return this.toRIBPayContract(contract);
  }

  async findByTerminal(
    terminalId: string,
    subAccount: string,
    query: ContractListQueryDto,
    baseUrl: string,
  ): Promise<ContractListResponseDto> {
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

    const result = contracts.map((contract) =>
      contract.contract_type === 'VADS'
        ? this.toVADSContract(contract)
        : this.toRIBPayContract(contract),
    );

    return {
      Contracts: result,
      Pagination: pagination,
    } as ContractListResponseDto;
  }

  async findByAccount(
    accountId: string,
    subAccount: string,
    query: ContractListQueryDto,
    baseUrl: string,
  ): Promise<ContractListResponseDto> {
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

    const result = contracts.map((contract) =>
      contract.contract_type === 'VADS'
        ? this.toVADSContract(contract)
        : this.toRIBPayContract(contract),
    );

    return {
      Contracts: result,
      Pagination: pagination,
    } as ContractListResponseDto;
  }

  async update(
    id: string,
    updateContractDto: UpdateContractDto,
    subAccount: string,
  ) {
    const terminal = await this.prisma.terminals.findUnique({
      where: {
        terminal_id: updateContractDto.terminal_id,
        creator_id: subAccount,
      },
    });

    if (!terminal) {
      throw new NotFoundException('Terminal does not exist');
    }

    const contract = await this.prisma.contracts.findUnique({
      where: {
        contract_id: id,
        creator_id: subAccount,
      },
    });

    // Find all contracts associated with the new terminal who are of contract_type contrcat.contract_type
    const contracts = await this.prisma.contracts.findMany({
      where: {
        terminal_id: updateContractDto.terminal_id,
        contract_type: contract.contract_type,
        creator_id: subAccount,
      },
    });

    if (contracts.length > 0) {
      throw new BadRequestException(
        'Terminal already has a contract of this type',
      );
    }
    await this.prisma.terminals.update({
      where: {
        terminal_id: updateContractDto.terminal_id,
        creator_id: subAccount,
      },
      data: {
        terminal_last_modified: new Date(),
      },
    });

    return await this.prisma.contracts.update({
      where: { contract_id: id, creator_id: subAccount },
      data: {
        terminal_id: updateContractDto.terminal_id,
        contract_last_modified: new Date(),
      },
    });
  }

  async remove(id: string, subAccount: string) {
    const contract = await this.prisma.contracts.findUnique({
      where: { contract_id: id, creator_id: subAccount },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    const responseAliasDeletion = await deleteAlias({
      alias_id: contract.contract_alias_id,
    });

    if (responseAliasDeletion instanceof Error) {
      throw new BadRequestException('Error deleting alias');
    }

    const responseAuthorizedAccountDeletion = await deleteAuthorizedAccount({
      authorized_account_id: contract.contract_merchant_id,
    });

    if (responseAuthorizedAccountDeletion instanceof Error) {
      throw new BadRequestException('Error deleting authorized account');
    }

    return await this.prisma.contracts.update({
      where: { contract_id: id, creator_id: subAccount },
      data: {
        contract_deleted_at: new Date(),
      },
    });
  }

  private toVADSContract(contract: any): VADSContractResponseDto {
    return {
      contract_id: contract.contract_id,
      contract_is_active: contract.contract_is_active,
      contract_created_at: contract.contract_created_at,
      contract_last_modified: contract.contract_last_modified,
      contract_deleted_at: contract.contract_deleted_at,
      contract_type: contract.contract_type,
      contract_number: contract.contract_number,
      contract_beneficiary_name: contract.contract_beneficiary_name,
      contract_merchant_id: contract.contract_merchant_id,
      terminal_id: contract.terminal_id,
      account_id: contract.account_id,
      creator_id: contract.creator_id,
      contract_bank_name: contract.contract_bank_name,
      contract_bank_code: contract.contract_bank_code,
      contract_3d_secure: contract.contract_3d_secure,
      contract_max_amount: contract.contract_max,
    };
  }

  private toRIBPayContract(contract: any): RIBPayContractResponseDto {
    return {
      contract_id: contract.contract_id,
      contract_created_at: contract.contract_created_at,
      contract_last_modified: contract.contract_last_modified,
      contract_deleted_at: contract.contract_deleted_at,
      contract_type: contract.contract_type,
      contract_number: contract.contract_number,
      contract_beneficiary_name: contract.contract_beneficiary_name,
      contract_merchant_id: contract.contract_merchant_id,
      terminal_id: contract.terminal_id,
      account_id: contract.account_id,
      creator_id: contract.creator_id,
      contract_alias_id: contract.contract_alias_id,
    };
  }
}
